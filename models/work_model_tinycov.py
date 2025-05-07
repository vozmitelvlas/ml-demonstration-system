import numpy as np
import pandas as pd
import tritonclient.http as httpclient
from tritonclient.utils import np_to_triton_dtype

# 1. Загрузка данных из CSV
def load_data_from_csv(csv_file, signal_length=187):
    """
    Загружает данные из CSV-файла и преобразует их в массив NumPy.
    :param csv_file: Путь к CSV-файлу.
    :param signal_length: Длина сигнала (количество точек).
    :return: Массив NumPy с данными.
    """
    # Загрузка CSV
    df = pd.read_csv(csv_file, header=None)
    
    # Удаление первой строки (пустой) и преобразование в массив NumPy
    data = df.iloc[:, :signal_length].values.astype(np.float32)
    
    return data

# 2. Подготовка данных для отправки
def prepare_input(data):
    """
    Подготавливает входные данные для отправки в Triton.
    :param data: Массив NumPy с данными.
    :return: Список объектов InferInput.
    """
    # Изменение размерности данных на [batch_size, channels, signal_length]
    data = np.expand_dims(data, axis=0)  # Добавляем batch_size
    data = np.expand_dims(data, axis=1)  # Добавляем каналы

    # Создание объекта InferInput
    inputs = [
        httpclient.InferInput(
            "input",  # Имя входного тензора (должно совпадать с конфигурацией модели)
            data.shape,  # Размерность данных
            np_to_triton_dtype(data.dtype)  # Тип данных
        )
    ]
    inputs[0].set_data_from_numpy(data)

    return inputs

# 3. Отправка запроса к Triton
def send_request_to_triton(triton_url, model_name, inputs):
    """
    Отправляет запрос к Triton Inference Server.
    :param triton_url: URL Triton сервера (например, "localhost:8000").
    :param model_name: Имя модели.
    :param inputs: Список объектов InferInput.
    :return: Результат вывода модели.
    """
    # Создание клиента
    client = httpclient.InferenceServerClient(url=triton_url)
    
    # Отправка запроса
    result = client.infer(
        model_name=model_name,
        inputs=inputs
    )
    
    # Получение выходных данных
    output = result.as_numpy("output")  # Имя выходного тензора (должно совпадать с конфигурацией модели)
    return output

# 4. Применение softmax для вычисления вероятностей
def softmax(logits):
    """
    Вычисляет softmax для преобразования логитов в вероятности.
    :param logits: Логиты от модели.
    :return: Вероятности для каждого класса.
    """
    exp_logits = np.exp(logits - np.max(logits))  # Для численной стабильности
    probabilities = exp_logits / np.sum(exp_logits)
    return probabilities

# 5. Обработка результата
def process_output(output):
    """
    Обрабатывает выходные данные модели и определяет предсказанный класс.
    :param output: Выходные данные модели (логиты).
    :return: Вероятности классов и предсказанный класс.
    """
    # Преобразуем логиты в вероятности
    probabilities = softmax(output[0])  # output[0]: первый элемент batch size
    
    # Определяем класс с наибольшей вероятностью
    predicted_class = np.argmax(probabilities)
    
    return probabilities, predicted_class

# 6. Основная функция
def main():
    # Параметры
    csv_file = "./signals/synthetic_ecg_data.csv"  # Путь к CSV-файлу
    triton_url = "localhost:8000"  # URL Triton сервера
    model_name = "tinycov_model"  # Имя модели
    signal_length = 187  # Длина сигнала
    
    # Загрузка данных
    print("Загрузка данных из CSV...")
    data = load_data_from_csv(csv_file, signal_length)
    
    # Выбор одного сигнала для тестирования
    test_signal = data[0]  # Первый сигнал
    
    # Подготовка данных
    print("Подготовка данных для отправки...")
    inputs = prepare_input(test_signal)
    
    # Отправка запроса
    print("Отправка запроса к Triton...")
    output = send_request_to_triton(triton_url, model_name, inputs)
    
    # Обработка результата
    probabilities, predicted_class = process_output(output)
    
    print("Результат модели:")
    print(f"Вероятности классов: {probabilities}")
    print(f"Предсказанный класс: {predicted_class}")

if __name__ == "__main__":
    main()