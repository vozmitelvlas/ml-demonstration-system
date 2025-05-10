import numpy as np
import pandas as pd
import tritonclient.http as httpclient
from tritonclient.utils import np_to_triton_dtype
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Загрузка данных из CSV
def load_data_from_csv(csv_file, signal_length=187):
    """
    Загружает данные из CSV-файла.
    :param csv_file: Путь к файлу с данными (последний столбец — метка)
    :param signal_length: Количество признаков (точек сигнала)
    :return: signals, labels
    """
    df = pd.read_csv(csv_file, header=None)

    # Последний столбец — это метки
    signals = df.iloc[:, :signal_length].values.astype(np.float32)
    labels = df.iloc[:, -1].values

    # Кодируем текстовые метки в числовые (например, "normal" -> 0, "afib" -> 1)
    le = LabelEncoder()
    encoded_labels = le.fit_transform(labels)

    return signals, encoded_labels


# 2. Подготовка входного тензора
def prepare_input(signal):
    """Подготавливает сигнал для отправки в Triton"""
    signal = np.expand_dims(signal, axis=0)  # Добавляем batch_size
    signal = np.expand_dims(signal, axis=1)  # Добавляем канал
    inputs = [
        httpclient.InferInput("input", signal.shape, np_to_triton_dtype(signal.dtype))
    ]
    inputs[0].set_data_from_numpy(signal)
    return inputs


# 3. Отправка запроса к Triton
def send_request(triton_url, model_name, inputs):
    client = httpclient.InferenceServerClient(url=triton_url)
    result = client.infer(model_name=model_name, inputs=inputs)
    return result.as_numpy("output")


# 4. Применение softmax
def softmax(logits):
    exp_logits = np.exp(logits - np.max(logits))  # Численная стабильность
    return exp_logits / np.sum(exp_logits)


# 5. Обработка выхода модели
def process_output(output, index=0):
    logits = output[index]
    probabilities = softmax(logits)
    predicted_class = np.argmax(probabilities)
    return probabilities, predicted_class


# 6. Функция оценки модели на всем наборе данных
def evaluate_model(triton_url, model_name, signals, true_labels):
    predicted_labels = []

    for idx in range(len(signals)):
        signal = signals[idx]
        inputs = prepare_input(signal)
        output = send_request(triton_url, model_name, inputs)
        _, predicted_class = process_output(output, index=0)
        predicted_labels.append(predicted_class)

    acc = accuracy_score(true_labels, predicted_labels)
    prec = precision_score(true_labels, predicted_labels, average='macro', zero_division=0)
    rec = recall_score(true_labels, predicted_labels, average='macro', zero_division=0)
    f1 = f1_score(true_labels, predicted_labels, average='macro', zero_division=0)

    print(f"Accuracy: {acc:.4f}")
    print(f"Precision (macro): {prec:.4f}")
    print(f"Recall (macro): {rec:.4f}")
    print(f"F1 Score (macro): {f1:.4f}")

    cm = confusion_matrix(true_labels, predicted_labels)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
    plt.title("Матрица ошибок")
    plt.xlabel("Предсказанный класс")
    plt.ylabel("Истинный класс")
    plt.show()

    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1": f1
    }


# 7. Основной запуск 
if __name__ == "__main__":
    triton_url = "localhost:8000"
    model_name = "tinycov_model"
    csv_path = "./signals/synthetic_ecg_data_1.csv"

    print("Загрузка данных...")
    signals, labels = load_data_from_csv(csv_path)

    print("Оценка модели...")
    metrics = evaluate_model(triton_url, model_name, signals, labels)

    print("\nРезультаты оценки:")
    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print(f"Precision: {metrics['precision']:.4f}")
    print(f"Recall: {metrics['recall']:.4f}")
    print(f"F1-score: {metrics['f1']:.4f}")