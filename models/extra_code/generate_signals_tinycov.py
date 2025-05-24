import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os

# ----------------------------
# Параметры
# ----------------------------

NUM_SAMPLES = 1000      # Общее количество сигналов
SIGNAL_LENGTH = 187     # Длина каждого сигнала
NUM_CLASSES = 5         # Число классов
AMPLITUDE = 1.0         # Амплитуда пика
NOISE_LEVEL = 0.2       # Уровень шума
OUTPUT_DIR = "../signals"  # Папка вывода
CSV_FILENAME = "synthetic_ecg_data_1.csv"

CLASSES = {
    0: 'normal',
    1: 'afib',        # Фибрилляция предсердий — высокочастотные колебания
    2: 'bradycardia', # Брадикардия — медленные пики
    3: 'tachycardia', # Тахикардия — частые пики
    4: 'extrasystole' # Экстрасистолия — дополнительные пики
}

# ----------------------------
# Функция: создание сигнала по типу
# ----------------------------

def generate_signal(signal_type='normal', length=187):
    t = np.arange(length)
    signal = np.zeros(length)

    if signal_type == 'normal':
        peaks = np.linspace(20, length - 20, 6).astype(int)
        for p in peaks:
            signal[p - 3:p + 4] = AMPLITUDE * np.array([0.2, 0.6, 1.0, 0.6, 0.2, 0.6, 0.2])

    elif signal_type == 'afib':
        # Много мелких колебаний
        signal = np.sin(np.linspace(0, 4 * np.pi, length)) * AMPLITUDE * 0.6
        signal += np.random.normal(0, NOISE_LEVEL, length)

    elif signal_type == 'bradycardia':
        # Редкие большие пики
        peaks = np.linspace(50, length - 50, 3).astype(int)
        for p in peaks:
            signal[p - 3:p + 4] = AMPLITUDE * np.array([0.1, 0.5, 1.0, 0.5, 0.1, 0.5, 0.1])

    elif signal_type == 'tachycardia':
        # Частые пики
        peaks = np.linspace(10, length - 10, 10).astype(int)
        for p in peaks:
            signal[p - 2:p + 3] = AMPLITUDE * np.array([0.2, 0.5, 1.0, 0.5, 0.2])

    elif signal_type == 'extrasystole':
        # Нормальные пики + один лишний
        base = generate_signal('normal', length=length)
        extra_peak_pos = np.random.randint(50, length - 50)
        base[extra_peak_pos - 3:extra_peak_pos + 4] = AMPLITUDE * np.array([0.2, 0.6, 1.0, 0.6, 0.2, 0.6, 0.2])
        return base

    # Добавляем общий шум
    signal += np.random.normal(0, NOISE_LEVEL, length)
    return signal


# ----------------------------
# Основная часть: генерация датасета
# ----------------------------

def generate_dataset():
    signals = []
    labels = []

    samples_per_class = NUM_SAMPLES // NUM_CLASSES

    print(f"[INFO] Генерация {samples_per_class} образцов на каждый из {NUM_CLASSES} классов")

    for cls_idx, cls_name in CLASSES.items():
        for _ in range(samples_per_class):
            signal = generate_signal(cls_name, SIGNAL_LENGTH)
            signals.append(signal)
            labels.append(cls_name)

    signals = np.array(signals).astype(np.float32)
    labels = np.array(labels)

    print("[INFO] Сохранение данных...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    df_signals = pd.DataFrame(signals)
    df_labels = pd.Series(labels, name='label')

    df_combined = pd.concat([df_signals, df_labels], axis=1)
    df_combined.to_csv(os.path.join(OUTPUT_DIR, CSV_FILENAME), index=False, header=False)

    print(f"[INFO] Данные сохранены в {OUTPUT_DIR}/{CSV_FILENAME}")
    return signals, labels


# ----------------------------
# Визуализация нескольких сигналов
# ----------------------------

def visualize_signals(signals, labels, num_examples=5):
    fig, axes = plt.subplots(num_examples, 1, figsize=(10, 6))
    for i in range(num_examples):
        axes[i].plot(signals[i])
        axes[i].set_title(f"Сигнал {i+1}; Класс: {labels[i]}")
        axes[i].axis('off')
    plt.tight_layout()
    plt.show()


# ----------------------------
# Запуск скрипта
# ----------------------------

if __name__ == "__main__":
    X, y = generate_dataset()
    visualize_signals(X, y)