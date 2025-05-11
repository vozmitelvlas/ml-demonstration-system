from fastapi import FastAPI, File, UploadFile
import pandas as pd
import numpy as np
import tritonclient.http as httpclient
from tritonclient.utils import np_to_triton_dtype
import uvicorn
import io

app = FastAPI()
triton_client = httpclient.InferenceServerClient(url="triton:8000")
MODEL_NAME = "unet_signal_processing"
BATCH_SIZE = 8
TARGET_LENGTH = 1024

@app.post("/unet/infer")
async def unet_infer(csv_file: UploadFile = File(...)):
    try:
        # Загрузка CSV как DataFrame
        contents = await csv_file.read()
        data = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        signals = data.values.astype(np.float32)

        # Паддинг до TARGET_LENGTH и батчи
        padded_signals = []
        original_lengths = []

        for signal in signals:
            original_lengths.append(len(signal))
            if len(signal) < TARGET_LENGTH:
                padded_signal = np.pad(signal, (0, TARGET_LENGTH - len(signal)), mode='constant')
            else:
                padded_signal = signal[:TARGET_LENGTH]
            padded_signals.append(padded_signal)

        input_data = np.array(padded_signals)
        input_data = np.expand_dims(input_data, axis=1)  # [batch_size, 1, 1024]

        # Формируем запрос к Triton
        inputs = [
            httpclient.InferInput("input", input_data.shape, np_to_triton_dtype(input_data.dtype))
        ]
        inputs[0].set_data_from_numpy(input_data)

        outputs = [
            httpclient.InferRequestedOutput("output")
        ]

        response = triton_client.infer(model_name=MODEL_NAME, inputs=inputs, outputs=outputs)
        output_data = response.as_numpy("output")

        # Обрезаем обратно до оригинальной длины
        corrected_output = []
        for i, length in enumerate(original_lengths):
            corrected_output.append(output_data[i][:length])

        return {
            "output": [pred.tolist() for pred in corrected_output],
            "model": MODEL_NAME,
            "batch_size": BATCH_SIZE
        }

    except Exception as e:
        return {"error": str(e)}