import torch
import torch.nn as nn
import torch.optim as optim
import torch.onnx
import os
import shutil
from torch.utils.data import DataLoader, TensorDataset


# ----------------------------
# 1. Определение модели TinyConv
# ----------------------------

class TinyConv(nn.Module):
    def __init__(self, input_channels=1, num_classes=5):
        super(TinyConv, self).__init__()
        self.features = nn.Sequential(
            nn.Conv1d(input_channels, 16, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool1d(kernel_size=2, stride=2),
            nn.Conv1d(16, 32, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool1d(kernel_size=2, stride=2)
        )
        # Глобальное усреднение и классификатор
        self.global_pool = nn.AdaptiveAvgPool1d(1)
        self.classifier = nn.Sequential(
            nn.Linear(32, 64),
            nn.ReLU(),
            nn.Linear(64, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.global_pool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x


# ----------------------------
# 2. Генерация синтетических данных
# ----------------------------

def generate_synthetic_data(num_samples=1000, signal_length=64, num_classes=5):
    """
    Создание простого синтетического набора данных.
    Для каждого класса создается "характерный" сигнал.
    """
    signals = []
    labels = []

    for class_idx in range(num_classes):
        base_signal = torch.randn(signal_length)  # Базовый шум
        peak = torch.zeros_like(base_signal)
        peak[signal_length // 2 - 5 : signal_length // 2 + 5] = 1.0  # Пик по центру
        for _ in range(num_samples // num_classes):
            noise = torch.randn_like(base_signal) * 0.1  # Небольшой шум
            signals.append(base_signal + 0.5 * class_idx * peak + noise)
            labels.append(class_idx)

    signals = torch.stack(signals).unsqueeze(1)  # [batch_size, channels=1, signal_length]
    labels = torch.tensor(labels)
    dataset = TensorDataset(signals, labels)
    return dataset


# ----------------------------
# 3. Функция обучения модели
# ----------------------------

def train_model(model, dataloader, epochs=10, lr=0.001, device="cpu"):
    model.to(device)
    model.train()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    print(f"[INFO] Обучение модели на {device}...")

    for epoch in range(epochs):
        total_loss = 0
        for inputs, targets in dataloader:
            inputs, targets = inputs.to(device), targets.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        print(f"Epoch [{epoch+1}/{epochs}], Loss: {total_loss/len(dataloader):.4f}")

    print("[INFO] Обучение завершено.")
    return model


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
            export_params=True,
            opset_version=11,
            do_constant_folding=True,
            input_names=["input"],
            output_names=["output"],
            dynamic_axes={
                "input": {0: "batch_size", 2: "signal_length"},
                "output": {0: "batch_size"}
            },
        )
    print(f"[INFO] Модель экспортирована в ONNX: {onnx_path}")


# ----------------------------
# 5. Создание структуры Triton Inference Server
# ----------------------------

def create_triton_structure(model_name, version, onnx_path):
    model_dir = os.path.join("model_repository", model_name)
    version_dir = os.path.join(model_dir, str(version))
    
    if os.path.exists(model_dir):
        shutil.rmtree(model_dir)
    os.makedirs(version_dir)

    # Копируем .onnx файл
    shutil.copy(onnx_path, os.path.join(version_dir, "model.onnx"))

    # Создаем config.pbtxt
    config_content = f"""
name: "{model_name}"
platform: "onnxruntime_onnx"
max_batch_size: 0
input [
  {{
    name: "input"
    data_type: TYPE_FP32
    dims: [-1, 1, -1]  # batch_size, channels, signal_length
  }}
]
output [
  {{
    name: "output"
    data_type: TYPE_FP32
    dims: [-1, 5]  # batch_size, num_classes
  }}
]
instance_group [
  {{
    kind: KIND_CPU
    count: 1
  }}
]
"""

    config_path = os.path.join(model_dir, "config.pbtxt")
    with open(config_path, "w") as f:
        f.write(config_content.strip())

    print(f"[INFO] Конфиг создан: {config_path}")
    print(f"[INFO] Структура модели готова в папке {model_dir}")


# ----------------------------
# 6. Основная часть
# ----------------------------

if __name__ == "__main__":
    # Параметры
    input_channels = 1     # количество входных каналов
    num_classes = 5       # количество классов сигналов
    signal_length = 64    # фиксированная длина сигнала
    num_samples = 1000    # размер выборки
    epochs = 10           # количество эпох
    batch_size = 8         # размер батча
    model_name = "tinycov_model"
    version = 1
    onnx_model_path = f"{model_name}.onnx"

    # 1. Генерация данных
    print(f"[INFO] Генерация синтетического датасета из {num_samples} образцов...")
    dataset = generate_synthetic_data(num_samples=num_samples, signal_length=signal_length, num_classes=num_classes)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    # 2. Инициализация модели
    model = TinyConv(input_channels=input_channels, num_classes=num_classes)

    # 3. Обучение модели
    train_model(model, dataloader, epochs=epochs)

    # 4. Экспорт в ONNX
    dummy_input = torch.randn(1, 1, signal_length)
    export_to_onnx(model, dummy_input, onnx_model_path)

    # 5. Создание структуры для Triton
    create_triton_structure(model_name, version, onnx_model_path)

    print("[INFO] Модель обучена, экспортирована и интегрирована в Triton Inference Server.")