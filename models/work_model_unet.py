import os
import pandas as pd
import numpy as np
import tritonclient.http as httpclient
from tritonclient.utils import np_to_triton_dtype
import matplotlib.pyplot as plt

# Функция для загрузки данных из CSV
def load_ecg_data(csv_path, target_length=1024):
    data = pd.read_csv(csv_path)
    # Удаляем последний столбец (метки классов, например, 'normal')
    signals = data.iloc[:, :-1].values.astype(np.float32)

    # Преобразуем данные к форме [num_samples, 1, target_length]
    padded_signals = []
    original_lengths = []  # Сохраняем исходные длины сигналов
    for signal in signals:
        original_lengths.append(len(signal))  # Запоминаем исходную длину
        if len(signal) < target_length:
            # Дополняем сигнал нулями, если он короче target_length
            padded_signal = np.pad(signal, (0, target_length - len(signal)), mode='constant')
        else:
            # Обрезаем сигнал, если он длиннее target_length
            padded_signal = signal[:target_length]
        padded_signals.append(padded_signal)

    # Преобразуем список в массив NumPy и добавляем размерность для каналов
    padded_signals = np.array(padded_signals)
    padded_signals = np.expand_dims(padded_signals, axis=1)  # Shape: [num_samples, 1, target_length]
    return padded_signals, original_lengths

# Функция для отправки запроса к модели
def send_request_to_triton(triton_client, model_name, input_data):
    # Подготовка входных данных
    inputs = []
    outputs = []

    # Добавляем входной тензор
    inputs.append(
        httpclient.InferInput("input", input_data.shape, np_to_triton_dtype(input_data.dtype))
    )
    inputs[0].set_data_from_numpy(input_data)

    # Добавляем выходной тензор
    outputs.append(httpclient.InferRequestedOutput("output"))

    # Отправляем запрос
    response = triton_client.infer(model_name=model_name, inputs=inputs, outputs=outputs)
    return response

# Основная функция
if __name__ == "__main__":
    # Параметры
    csv_path = "./signals/synthetic_ecg_data.csv"  # Путь к файлу с данными
    model_name = "unet_signal_processing"  # Имя модели в Triton
    triton_url = "localhost:8000"  # URL Triton Inference Server

    # Загружаем данные
    print("Загрузка данных из CSV...")
    ecg_signals, original_lengths = load_ecg_data(csv_path)

    # Создаем клиента Triton
    print("Подключение к Triton Inference Server...")
    triton_client = httpclient.InferenceServerClient(url=triton_url)
    if not triton_client.is_server_ready():
        raise Exception("Triton Inference Server не готов!")

    # Отправляем запрос
    print("Отправка запроса к модели...")
    response = send_request_to_triton(triton_client, model_name, ecg_signals)

    # Получаем результат
    output_data = response.as_numpy("output")
    print("Результат получен. Форма выходных данных:", output_data.shape)

    # Корректируем выходные данные до исходной длины
    corrected_output_data = []
    for i, original_length in enumerate(original_lengths):
        corrected_output_data.append(output_data[i][:original_length])  # Обрезаем до исходной длины

    # Сохраняем результаты (например, в CSV)
    output_path = "./signals/processed_ecg_data.csv"
    print(f"Сохранение обработанных данных в {output_path}...")

    # Убираем лишнюю размерность (axis=1) и преобразуем данные в DataFrame
    corrected_output_data = np.array(corrected_output_data).squeeze(axis=1)  # Shape: [num_samples, target_length]
    pd.DataFrame(corrected_output_data).to_csv(output_path, index=False, header=False)

    print("Готово!")

    # Загрузка исходных данных
    input_data = pd.read_csv("./signals/synthetic_ecg_data.csv").iloc[:, :-1].values
    output_data = pd.read_csv("./signals/processed_ecg_data.csv", header=None).values

    # Визуализация первого сигнала и его маски
    plt.figure(figsize=(12, 6))
    plt.subplot(2, 1, 1)
    plt.plot(input_data[0], label="Input Signal")
    plt.title("Input Signal")
    plt.legend()

    plt.subplot(2, 1, 2)
    plt.plot(output_data[0], label="Output Mask", color="orange")
    plt.title("Output Mask")
    plt.legend()

    plt.tight_layout()
    plt.show()