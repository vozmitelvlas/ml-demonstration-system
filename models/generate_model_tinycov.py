import torch
import torch.nn as nn
import torch.onnx
import os
import shutil

# 1. Определение модели TinyConv
class TinyConv(nn.Module):
    def __init__(self, input_channels=1, num_classes=10):
        super(TinyConv, self).__init__()
        self.features = nn.Sequential(
            nn.Conv1d(input_channels, 16, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool1d(kernel_size=2, stride=2),
            nn.Conv1d(16, 32, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool1d(kernel_size=2, stride=2)
        )
        self.classifier = nn.Sequential(
            nn.Linear(32 * 8, 64),  # Предполагается входной сигнал длиной 32
            nn.ReLU(),
            nn.Linear(64, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)  # Flatten для линейного слоя
        x = self.classifier(x)
        return x

# 2. Создание экземпляра модели и подготовка данных
input_channels = 1  # Например, одномерный сигнал (ECG, аудио)
num_classes = 5     # Количество классов для классификации
model = TinyConv(input_channels=input_channels, num_classes=num_classes)

# Пример входных данных (batch_size=1, channels=1, signal_length=32)
dummy_input = torch.randn(1, 1, 32)

# 3. Экспорт модели в ONNX
onnx_model_path = "tinycov_model.onnx"
torch.onnx.export(
    model,                      # Модель PyTorch
    dummy_input,                # Пример входных данных
    onnx_model_path,            # Путь сохранения ONNX-файла
    export_params=True,         # Экспортировать обученные параметры
    opset_version=11,           # Версия ONNX операторов
    do_constant_folding=True,   # Оптимизация констант
    input_names=["input"],      # Имя входного тензора
    output_names=["output"],    # Имя выходного тензора
    dynamic_axes={              # Динамические размеры для batch size
        "input": {0: "batch_size"},
        "output": {0: "batch_size"}
    }
)

print(f"Модель успешно экспортирована в {onnx_model_path}")

# 4. Подготовка модели для Triton Inference Server
# Путь к репозиторию моделей
model_repository_path = "model_repository"

# Имя модели и версия
model_name = "tinycov_model"
version = "1"

# Создание структуры папок для Triton
model_dir = os.path.join(model_repository_path, model_name)
version_dir = os.path.join(model_dir, version)
os.makedirs(version_dir, exist_ok=True)

# Копирование ONNX-файла в папку версии
shutil.copy(onnx_model_path, os.path.join(version_dir, "model.onnx"))

# Создание файла config.pbtxt
config_pbtxt = f"""
name: "{model_name}"
platform: "onnxruntime_onnx"
max_batch_size: 0
input [
  {{
    name: "input"
    data_type: TYPE_FP32
    dims: [-1, 1, 32]  # Размерность входных данных без батча
  }}
]
output [
  {{
    name: "output"
    data_type: TYPE_FP32
    dims: [-1, 5]  # Размерность выходных данных
  }}
]
instance_group [
  {{
    kind: KIND_CPU
    count: 1
  }}
]
"""

# Сохранение файла config.pbtxt
with open(os.path.join(model_dir, "config.pbtxt"), "w") as f:
    f.write(config_pbtxt)

print(f"Модель успешно размещена в папке {model_dir}")