import numpy as np
from tritonclient.http import InferenceServerClient, InferInput, InferRequestedOutput

# 1. Настройка подключения к Triton Inference Server
TRITON_SERVER_URL = "localhost:8000"  # URL сервера
MODEL_NAME = "tinycov_model"          # Имя модели

# Создание клиента
client = InferenceServerClient(url=TRITON_SERVER_URL)

# Проверка доступности модели
if not client.is_model_ready(MODEL_NAME):
    raise Exception(f"Модель {MODEL_NAME} недоступна на сервере.")

print(f"Модель {MODEL_NAME} доступна.")

# 2. Подготовка входных данных
def prepare_input_data():
    """
    Создаёт входные данные для модели.
    В данном случае это одномерный сигнал длиной 32.
    """
    batch_size = 1  # Размер батча
    signal_length = 32  # Длина сигнала
    input_data = np.random.randn(batch_size, 1, signal_length).astype(np.float32)  # [batch_size, channels, signal_length]
    return input_data

input_data = prepare_input_data()

# 3. Настройка входного тензора
input_tensor = InferInput("input", input_data.shape, "FP32")
input_tensor.set_data_from_numpy(input_data)

# 4. Настройка выходного тензора
output_tensor = InferRequestedOutput("output")

# 5. Выполнение запроса к серверу
results = client.infer(
    model_name=MODEL_NAME,
    inputs=[input_tensor],
    outputs=[output_tensor]
)

# 6. Получение результата
output_data = results.as_numpy("output")
print("Результат модели:", output_data)

# 7. Интерпретация результата (если это классификация)
if output_data is not None:
    predicted_class = np.argmax(output_data, axis=1)  # Определение класса с максимальной вероятностью
    print("Предсказанный класс:", predicted_class)