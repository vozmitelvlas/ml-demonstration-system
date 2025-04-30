import os
import torch
import torch.nn as nn
import torch.onnx
from pathlib import Path

# Определение модели U-Net
class UNet(nn.Module):
    def __init__(self):
        super(UNet, self).__init__()
        # Пример простой архитектуры U-Net
        self.encoder = nn.Sequential(
            nn.Conv1d(1, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv1d(64, 128, kernel_size=3, padding=1),
            nn.ReLU()
        )
        self.decoder = nn.Sequential(
            nn.ConvTranspose1d(128, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.ConvTranspose1d(64, 1, kernel_size=3, padding=1),
            nn.Sigmoid()
        )

    def forward(self, x):
        x = self.encoder(x)
        x = self.decoder(x)
        return x

# Функция для экспорта модели в ONNX
def export_to_onnx(model, dummy_input, onnx_path):
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        input_names=["input"],
        output_names=["output"],
        opset_version=11,
        dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}}
    )
    print(f"Модель успешно экспортирована в {onnx_path}")

# Функция для создания структуры папок Triton
def create_triton_model_repository(model_name, version, onnx_path, config_path):
    # Создание директорий
    model_dir = os.path.join("model_repository", model_name)
    version_dir = os.path.join(model_dir, str(version))
    os.makedirs(version_dir, exist_ok=True)

    # Копирование ONNX файла
    os.system(f"cp {onnx_path} {version_dir}/model.onnx")

    # Создание config.pbtxt
    config_content = f"""
name: "{model_name}"
platform: "onnxruntime_onnx"
max_batch_size: 0
input [
  {{
    name: "input"
    data_type: TYPE_FP32
    dims: [-1, 1, 1024]  # Размер входного сигнала с учётом batch_size
  }}
]
output [
  {{
    name: "output"
    data_type: TYPE_FP32
    dims: [-1, 1, 1024]  # Размер выходного сигнала с учётом batch_size
  }}
]
instance_group [
  {{
    kind: KIND_CPU
    count: 1
  }}
]
"""
    with open(config_path, "w") as f:
        f.write(config_content)
    print(f"Конфигурационный файл создан: {config_path}")

# Основная функция
if __name__ == "__main__":
    # Инициализация модели
    model = UNet()
    model.eval()

    # Подготовка входных данных
    dummy_input = torch.randn(1, 1, 1024)  # Пример входного сигнала (batch_size=1, channels=1, length=1024)

    # Параметры для экспорта
    model_name = "unet_signal_processing"
    version = 1
    onnx_path = f"{model_name}.onnx"
    config_path = os.path.join("model_repository", model_name, "config.pbtxt")

    # Экспорт модели в ONNX
    export_to_onnx(model, dummy_input, onnx_path)

    # Создание структуры папок и конфигурации для Triton
    create_triton_model_repository(model_name, version, onnx_path, config_path)