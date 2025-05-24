from fastapi import FastAPI, File, UploadFile
import pandas as pd
import numpy as np
import tritonclient.http as httpclient
from tritonclient.utils import np_to_triton_dtype
import uvicorn
import io

app = FastAPI()

# Подключение к Triton Inference Server
try:
    triton_client = httpclient.InferenceServerClient(url="triton:8000")
    print("Успешно подключились к Triton Inference Server")
except Exception as e:
    print(f"Не удалось подключиться к Triton: {e}")

MODEL_NAME = "tinycov_model"
SIGNAL_LENGTH = 187  # Длина сигнала, которую ожидает модель


def softmax(logits):
    """Применяет softmax для получения вероятностей"""
    exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
    return exp_logits / np.sum(exp_logits, axis=1, keepdims=True)


@app.post("/tinyconv/infer")
async def tinyconv_infer(csv_file: UploadFile = File(...)):
    print("Функция /tinyconv/infer вызвана")

    try:
        # Чтение CSV-файла
        contents = await csv_file.read()
        data = pd.read_csv(io.StringIO(contents.decode("utf-8")))

        # Оставляем только числовые колонки
        signals_df = data.select_dtypes(include=[np.number])
        signals_df = signals_df.apply(pd.to_numeric, errors='coerce')
        signals_df.fillna(0.0, inplace=True)
        signals = signals_df.values.astype(np.float32)

        # Проверяем длину сигнала
        if signals.shape[1] != SIGNAL_LENGTH:
            return {"error": f"Ожидалось {SIGNAL_LENGTH} значений на строку, получено: {signals.shape[1]}"}

        # Подготовка данных для модели
        input_data = np.expand_dims(signals, axis=1)  # [batch_size, 1, SIGNAL_LENGTH]

        # Формируем запрос к Triton
        inputs = [
            httpclient.InferInput("input", input_data.shape, np_to_triton_dtype(input_data.dtype))
        ]
        inputs[0].set_data_from_numpy(input_data)

        outputs = [
            httpclient.InferRequestedOutput("output")
        ]

        # Выполняем инференс
        response = triton_client.infer(model_name=MODEL_NAME, inputs=inputs, outputs=outputs)
        output_data = response.as_numpy("output")  # shape: [batch_size, num_classes]

        # Применяем softmax
        probabilities = softmax(output_data)
        predicted_classes = np.argmax(probabilities, axis=1).tolist()

        # Имена классов (замените на свои, если отличаются)
        class_names = ["Нормальный", "Фибрилляция", "Другая аритмия", "Шум", "Неопределённый"]

        # Маппинг id → имя класса
        predicted_labels = [class_names[i] for i in predicted_classes]

        # Возвращаем результаты
        return {
            #"predictions": output_data.tolist(),              # сырые логиты
            #"probabilities": probabilities.tolist(),           # вероятности
            "predicted_class_ids": predicted_classes,          # номера классов
            "predicted_class_names": predicted_labels,         # названия классов
            "model": MODEL_NAME,
            "total_samples": len(signals),
        }

    except Exception as e:
        return {"error": str(e)}