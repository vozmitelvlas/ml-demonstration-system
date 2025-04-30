import numpy as np
import pandas as pd

# Параметры генерации
num_samples_per_class = 1000  # Количество образцов на каждый класс
signal_length = 187          # Длина сигнала (временной ряд)
noise_level = 0.05           # Уровень шума
classes = ["normal", "atrial_fibrillation", "ventricular_tachycardia"]

# Функция для генерации сигнала
def generate_signal(class_label, length, noise=0.0):
    if class_label == "normal":
        # Нормальный ритм: синусоидальная волна с небольшими колебаниями
        t = np.linspace(0, 2 * np.pi, length)
        signal = np.sin(t) + np.random.normal(0, noise, length)
    elif class_label == "atrial_fibrillation":
        # Предсердная фибрилляция: хаотичные колебания
        signal = np.random.normal(0, 1, length) + np.random.normal(0, noise, length)
    elif class_label == "ventricular_tachycardia":
        # Желудочковая тахикардия: высокочастотные колебания
        t = np.linspace(0, 4 * np.pi, length)
        signal = np.sin(2 * t) + np.random.normal(0, noise, length)
    return signal

# Генерация данных
data = []
labels = []

for class_label in classes:
    for _ in range(num_samples_per_class):
        signal = generate_signal(class_label, signal_length, noise=noise_level)
        data.append(signal)
        labels.append(class_label)

# Создание DataFrame
df = pd.DataFrame(data)
df["label"] = labels

# Сохранение в CSV
df.to_csv("synthetic_ecg_data.csv", index=False)

print("Синтетический датасет успешно создан и сохранён в 'synthetic_ecg_data.csv'")