import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import tritonclient.http as httpclient
from tritonclient.utils import np_to_triton_dtype
from sklearn.metrics import jaccard_score


# ----------------------------
# Функции
# ----------------------------

def load_ecg_data(csv_path, target_length=1024):
    """Загружает данные ЭКГ из CSV и приводит их к нужной форме"""
    data = pd.read_csv(csv_path)
    signals = data.iloc[:, :-1].values.astype(np.float32)

    padded_signals = []
    original_lengths = []

    for signal in signals:
        original_lengths.append(len(signal))
        if len(signal) < target_length:
            padded_signal = np.pad(signal, (0, target_length - len(signal)), mode='constant')
        else:
            padded_signal = signal[:target_length]
        padded_signals.append(padded_signal)

    padded_signals = np.array(padded_signals)
    padded_signals = np.expand_dims(padded_signals, axis=1)  # [num_samples, 1, target_length]

    return padded_signals, original_lengths


def send_request_to_triton(triton_client, model_name, input_data):
    """Отправляет запрос к Triton Inference Server"""
    inputs = [
        httpclient.InferInput("input", input_data.shape, np_to_triton_dtype(input_data.dtype))
    ]
    inputs[0].set_data_from_numpy(input_data)

    outputs = [
        httpclient.InferRequestedOutput("output")
    ]

    response = triton_client.infer(model_name=model_name, inputs=inputs, outputs=outputs)
    return response


def evaluate_segmentation(y_true, y_pred, threshold=0.1):
    """Вычисляет IoU и Dice Score для бинарной сегментации"""
    y_pred_binary = (y_pred > threshold).astype(int)

    # Убедимся, что массивы плоские
    y_true = y_true.flatten()
    y_pred_binary = y_pred_binary.flatten()

    iou = jaccard_score(y_true, y_pred_binary, average='binary', zero_division=0)
    dice = (2 * np.sum(y_true * y_pred_binary)) / (np.sum(y_true) + np.sum(y_pred_binary))
    return {'IoU': iou, 'Dice': dice}


# ----------------------------
# Основная часть
# ----------------------------

if __name__ == "__main__":
    # Параметры
    csv_path = "./signals/synthetic_ecg_data.csv"
    true_masks_path = "./signals/true_masks.csv"
    model_name = "unet_signal_processing"
    triton_url = "localhost:8000"
    BATCH_SIZE = 8  # Максимальный допустимый батч для Triton

    print("Загрузка данных из CSV...")
    ecg_signals, original_lengths = load_ecg_data(csv_path)

    print("Проверка наличия истинных масок...")
    if not os.path.exists(true_masks_path):
        print("Файл истинных масок не найден. Генерация масок на основе порога...")
        # Простая генерация масок на основе порога
        from sklearn.preprocessing import binarize
        signals_flat = ecg_signals.squeeze(axis=1)
        masks = binarize(signals_flat, threshold=0.5).astype(int)
        pd.DataFrame(masks).to_csv(true_masks_path, index=False, header=None)
    else:
        print("Загрузка истинных масок...")

    true_masks = pd.read_csv(true_masks_path, header=None).values

    print("Подключение к Triton Inference Server...")
    triton_client = httpclient.InferenceServerClient(url=triton_url)
    if not triton_client.is_server_ready():
        raise Exception("Triton Inference Server не готов!")

    print("Отправка запроса к модели порциями...")
    all_output_data = []

    num_samples = ecg_signals.shape[0]
    for i in range(0, num_samples, BATCH_SIZE):
        batch = ecg_signals[i:i + BATCH_SIZE]
        response = send_request_to_triton(triton_client, model_name, batch)
        output_data = response.as_numpy("output")
        all_output_data.extend(output_data)

    print("Результат получен.")

    print("Коррекция выходных данных до исходной длины...")
    corrected_output_data = []
    for i, original_length in enumerate(original_lengths):
        corrected_output_data.append(all_output_data[i][:original_length])
    corrected_output_data = np.array(corrected_output_data).squeeze(axis=1)
    pd.DataFrame(corrected_output_data).to_csv("./signals/processed_ecg_data.csv", index=False, header=None)

    print("Оценка качества работы модели...")
    iou_scores = []
    dice_scores = []

    for true_mask, pred_mask in zip(true_masks, corrected_output_data):
        # Проверяем форму
        if len(true_mask.shape) > 1:
            true_mask = true_mask.flatten()
        if len(pred_mask.shape) > 1:
            pred_mask = pred_mask.flatten()

        metrics = evaluate_segmentation(true_mask, pred_mask)
        iou_scores.append(metrics['IoU'])
        dice_scores.append(metrics['Dice'])

    print(f"Средний IoU: {np.mean(iou_scores):.4f}")
    print(f"Средний Dice: {np.mean(dice_scores):.4f}")

    print("Визуализация первого сигнала и его маски...")
    input_data = pd.read_csv(csv_path).iloc[:, :-1].values
    output_data = pd.read_csv("./signals/processed_ecg_data.csv", header=None).values

    plt.figure(figsize=(12, 6))
    plt.subplot(2, 1, 1)
    plt.plot(input_data[0], label="Исходный сигнал")
    plt.title("Исходный сигнал")
    plt.legend()

    plt.subplot(2, 1, 2)
    plt.plot(output_data[0], label="Предсказанная маска", color="orange")
    plt.title("Маска сегментации")
    plt.legend()

    plt.tight_layout()
    plt.show()