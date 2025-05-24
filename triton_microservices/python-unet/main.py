from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
import tritonclient.http as httpclient
from tritonclient.utils import np_to_triton_dtype
import uvicorn
import io
import base64
import logging
import matplotlib.pyplot as plt

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Подключение к Triton Inference Server
try:
    triton_client = httpclient.InferenceServerClient(url="triton:8000")
    logger.info("Успешно подключились к Triton Inference Server")
except Exception as e:
    logger.error(f"Не удалось подключиться к Triton: {e}")

MODEL_NAME = "unet_signal_processing"
BATCH_SIZE = 8
TARGET_LENGTH = 1024  # Длина сигнала, которую ожидает модель


@app.post("/unet/infer")
async def unet_infer(csv_file: UploadFile = File(...)):
    print("Функция /unet/infer вызвана")  # Для отладки в Docker
    logger.info("Получен запрос на обработку файла")

    try:
        # Чтение содержимого файла
        contents = await csv_file.read()
        data = pd.read_csv(io.StringIO(contents.decode("utf-8")))

        # Оставляем только числовые колонки
        signals_df = data.select_dtypes(include=[np.number])
        signals_df = signals_df.apply(pd.to_numeric, errors='coerce')
        signals_df.fillna(0.0, inplace=True)
        signals = signals_df.values.astype(np.float32)

        # Сохраняем оригинальные длины для коррекции выхода
        original_lengths = [len(signal) for signal in signals]

        # Паддинг/обрезка до TARGET_LENGTH
        padded_signals = []
        for signal in signals:
            if len(signal) < TARGET_LENGTH:
                padded_signal = np.pad(signal, (0, TARGET_LENGTH - len(signal)), mode='constant')
            else:
                padded_signal = signal[:TARGET_LENGTH]
            padded_signals.append(padded_signal)
        input_data = np.array(padded_signals, dtype=np.float32)
        input_data = np.expand_dims(input_data, axis=1)  # Форма: [batch_size, 1, 1024]

        # Инференс батчами
        all_output_data = []
        for i in range(0, len(input_data), BATCH_SIZE):
            batch = input_data[i:i + BATCH_SIZE]
            logger.info(f"Отправляем батч #{i // BATCH_SIZE + 1}, размер: {len(batch)}")

            inputs = [
                httpclient.InferInput("input", batch.shape, np_to_triton_dtype(batch.dtype))
            ]
            inputs[0].set_data_from_numpy(batch)

            outputs = [
                httpclient.InferRequestedOutput("output")
            ]

            response = triton_client.infer(model_name=MODEL_NAME, inputs=inputs, outputs=outputs)
            output_data = response.as_numpy("output")
            all_output_data.extend(output_data)

        # Коррекция результатов под оригинальные длины
        corrected_output = []
        for i, length in enumerate(original_lengths):
            corrected_output.append(all_output_data[i][:length])

        # Генерация графиков
        sample_input = signals[0]  # Первый сигнал
        sample_output = corrected_output[0].flatten()  # Его предсказание

        # --- График 1: Оригинальный сигнал ---
        plt.figure(figsize=(5, 3))
        plt.plot(sample_input, color='blue')
        plt.title("Оригинальный сигнал")
        plt.xlabel("Отсчеты")
        plt.ylabel("Амплитуда")
        plt.grid(True)
        buf1 = io.BytesIO()
        plt.savefig(buf1, format='png', dpi=100)
        plt.close()
        image1_base64 = base64.b64encode(buf1.getvalue()).decode('utf-8')

        # --- График 2: Предсказание модели ---
        plt.figure(figsize=(5, 3))
        plt.plot(sample_output, color='orange')
        plt.title("Предсказание U-Net")
        plt.xlabel("Отсчеты")
        plt.ylabel("Значение")
        plt.grid(True)
        buf2 = io.BytesIO()
        plt.savefig(buf2, format='png', dpi=100)
        plt.close()
        image2_base64 = base64.b64encode(buf2.getvalue()).decode('utf-8')

        return JSONResponse(content={
            "original_signal": f"data:image/png;base64,{image1_base64}",
            "predicted_signal": f"data:image/png;base64,{image2_base64}",
            "total_samples": len(signals),
            "model": MODEL_NAME
        })

    except Exception as e:
        logger.error(f"Ошибка при обработке: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5100)