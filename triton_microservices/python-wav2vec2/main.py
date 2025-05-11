from fastapi import FastAPI, File, UploadFile
import librosa
import numpy as np
import tritonclient.http as httpclient
from transformers import Wav2Vec2Processor
import uvicorn

app = FastAPI()
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
triton_client = httpclient.InferenceServerClient(url="triton:8000")

@app.post("/wav2vec2/infer")
async def wav2vec2_infer(audio_file: UploadFile = File(...)):
    waveform, sr = librosa.load(audio_file.file, sr=16000)
    input_data = waveform[np.newaxis, :].astype(np.float32)

    # Формируем входной тензор
    inputs = [httpclient.InferInput("input", input_data.shape, "FP32")]
    inputs[0].set_data_from_numpy(input_data)

    outputs = [httpclient.InferRequestedOutput("output")]

    # Запуск Triton
    response = triton_client.infer(model_name="wav2vec2", inputs=inputs, outputs=outputs)
    logits = response.as_numpy("output")
    predicted_ids = np.argmax(logits, axis=-1)
    transcription = processor.decode(predicted_ids[0])

    return {"transcription": transcription}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)