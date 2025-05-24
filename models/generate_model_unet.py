import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
import torch.onnx
from pathlib import Path
import shutil

# ----------------------------
# 1. Определение улучшенной U-Net с skip-соединениями
# ----------------------------

class UNetImproved(nn.Module):
    def __init__(self):
        super(UNetImproved, self).__init__()
        self.enc1 = self.conv_block(1, 64)
        self.enc2 = self.conv_block(64, 128)
        self.downsample = nn.MaxPool1d(2)

        self.upconv2 = nn.ConvTranspose1d(128, 64, kernel_size=2, stride=2)
        self.dec2 = self.conv_block(128, 64)  # 128 = 64 + 64
        self.final_conv = nn.Conv1d(64, 1, kernel_size=1)
        self.sigmoid = nn.Sigmoid()

    def conv_block(self, in_channels, out_channels):
        return nn.Sequential(
            nn.Conv1d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm1d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv1d(out_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm1d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        enc1_out = self.enc1(x)
        enc2_out = self.enc2(self.downsample(enc1_out))

        dec2_in = self.upconv2(enc2_out)
        dec2_in = torch.cat((dec2_in, enc1_out), dim=1)
        dec2_out = self.dec2(dec2_in)

        return self.sigmoid(self.final_conv(dec2_out))


# ----------------------------
# 2. Функция обучения модели
# ----------------------------

def train_model(model, dataloader, epochs=10, lr=0.001):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    optimizer = optim.Adam(model.parameters(), lr=lr)
    criterion = nn.BCELoss()  # Бинарная кросс-энтропия

    print(f"Обучение модели на {device}...")
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for inputs, targets in dataloader:
            inputs, targets = inputs.to(device), targets.to(device)

            # Убедимся, что targets имеет ту же форму, что и выход модели
            if len(targets.shape) == 2:
                targets = targets.unsqueeze(1)  # [batch_size, 1, length]

            optimizer.zero_grad()
            outputs = model(inputs)  # [batch_size, 1, length]
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        print(f"Epoch {epoch+1}/{epochs}, Loss: {total_loss/len(dataloader):.4f}")
    print("Обучение завершено.")
    return model


# ----------------------------
# 3. Генерация синтетического датасета
# ----------------------------

def generate_dataset(num_samples=1000, signal_length=1024):
    """Генерация синтетических сигналов и масок"""
    signals = torch.randn(num_samples, 1, signal_length)
    masks = torch.zeros_like(signals)

    # Пример: выделяем центральные 10% сигнала как активную область
    mask_width = int(signal_length * 0.1)
    center = signal_length // 2
    masks[:, :, center - mask_width//2 : center + mask_width//2] = 1.0

    dataset = TensorDataset(signals, masks)
    dataloader = DataLoader(dataset, batch_size=8, shuffle=True)

    return dataloader


# ----------------------------
# 4. Экспорт модели в ONNX
# ----------------------------

def export_to_onnx(model, dummy_input, onnx_path):
    model.eval()
    with torch.no_grad():
        torch.onnx.export(
            model,
            dummy_input,
            onnx_path,
            input_names=["input"],
            output_names=["output"],
            opset_version=11,
            dynamic_axes={
                "input": {0: "batch_size"},
                "output": {0: "batch_size"}
            }
        )
    print(f"Модель экспортирована в {onnx_path}")


# ----------------------------
# 5. Создание структуры модели для Triton
# ----------------------------

def create_triton_config(model_name="unet_signal_processing"):
    MODEL_DIR = Path("model_repository") / model_name
    VERSION_DIR = MODEL_DIR / "1"
    onnx_path = f"{model_name}.onnx"

    if MODEL_DIR.exists():
        shutil.rmtree(MODEL_DIR)
    VERSION_DIR.mkdir(parents=True, exist_ok=True)

    # Копируем .onnx в нужную папку под названием 'model.onnx'
    shutil.copy(onnx_path, VERSION_DIR / "model.onnx")

    config_content = f"""
name: "{model_name}"
platform: "onnxruntime_onnx"
max_batch_size: 8
input [
  {{
    name: "input"
    data_type: TYPE_FP32
    dims: [1, 1024]
  }}
]
output [
  {{
    name: "output"
    data_type: TYPE_FP32
    dims: [1, 1024]
  }}
]
instance_group [
  {{
    kind: KIND_CPU
    count: 1
  }}
]
dynamic_batching {{
  max_queue_delay_microseconds: 100000
}}
"""

    with open(MODEL_DIR / "config.pbtxt", "w") as f:
        f.write(config_content.strip())

    print(f"Конфиг создан по пути: {MODEL_DIR / 'config.pbtxt'}")
    os.remove(onnx_path)
    print(f"Временный файл удален: {onnx_path}")


# ----------------------------
# 6. Основная часть
# ----------------------------

if __name__ == "__main__":
    MODEL_NAME = "unet_signal_processing"
    EPOCHS = 10
    SIGNAL_LENGTH = 1024
    BATCH_SIZE = 8

    print("Генерация синтетического датасета...")
    dataloader = generate_dataset(num_samples=1000, signal_length=SIGNAL_LENGTH)

    print("Инициализация модели...")
    model = UNetImproved()

    print("Обучение модели...")
    trained_model = train_model(model, dataloader, epochs=EPOCHS)

    print("Экспорт модели в ONNX...")
    dummy_input = torch.randn(1, 1, SIGNAL_LENGTH)
    export_to_onnx(trained_model, dummy_input, f"{MODEL_NAME}.onnx")

    print("Создание структуры модели для Triton...")
    create_triton_config(MODEL_NAME)

    print("Модель обучена, экспортирована и готова к запуску через Triton.")