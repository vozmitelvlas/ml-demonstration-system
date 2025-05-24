import requests
import numpy as np
import time
import json
from tqdm import tqdm

# Параметры
TRITON_URL = "http://localhost:8000/v2/models/tinycov_model/infer"
BATCH_SIZES = [1, 4, 8]
NUM_REQUESTS = 1000  # Число запросов
INPUT_LENGTH = 1024  # Длина входного сигнала
INPUT_CHANNELS = 1   # Количество каналов

def generate_dummy_signal(length=1024):
    """Генерация случайного сигнала"""
    return np.random.randn(1, INPUT_CHANNELS, length).astype(np.float32)

def send_inference_request(input_data):
    """Отправка одного инференс-запроса"""
    payload = {
        "inputs": [
            {
                "name": "input",
                "shape": input_data.shape,
                "datatype": "FP32",
                "data": input_data.tolist()
            }
        ]
    }

    start_time = time.time()
    try:
        response = requests.post(TRITON_URL, json=payload)
        end_time = time.time()

        if response.status_code == 200:
            return end_time - start_time, True
        else:
            print(f"Ошибка {response.status_code}: {response.text}")
            return end_time - start_time, False
    except Exception as e:
        print(f"Исключение при отправке запроса: {e}")
        return time.time() - start_time, False

def run_benchmark(batch_size, num_requests):
    """Проведение серии тестов"""
    latencies = []
    successes = []

    print(f"\n🧪 Тестирование с batch_size={batch_size}, {num_requests} запросов")

    for i in tqdm(range(num_requests), desc="Выполнение запросов"):
        signal = generate_dummy_signal(INPUT_LENGTH)
        latency, success = send_inference_request(signal)
        latencies.append(latency)
        successes.append(success)

    avg_latency = sum(latencies) / len(latencies)
    total_time = sum(latencies)
    throughput = num_requests / total_time

    print(f"📊 Результаты:")
    print(f"  Среднее время инференса: {avg_latency:.3f} сек.")
    print(f"  Пропускная способность: {throughput:.2f} req/sec")
    print(f"  Успешных запросов: {sum(successes)} из {len(successes)}")

    return {
        "batch_size": batch_size,
        "num_requests": num_requests,
        "avg_latency_sec": avg_latency,
        "throughput_rps": throughput,
        "success_rate": sum(successes) / len(successes)
    }

if __name__ == "__main__":
    results = []

    for bs in BATCH_SIZES:
        # Меняем конфигурацию Triton (это делается отдельно через config.pbtxt)
        print(f"\n🔄 Переключение на режим batch_size={bs}. Обновите config.pbtxt вручную.")

        # Ждём перезагрузки модели в Triton
        input("Нажмите Enter после обновления конфигурации и перезапуска сервера...")

        # Запуск тестирования
        result = run_benchmark(bs, NUM_REQUESTS)
        results.append(result)