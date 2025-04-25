import os
import numpy as np
from pydub import AudioSegment
from transformers import WhisperFeatureExtractor
import matplotlib.pyplot as plt
import tritonclient.grpc as grpcclient
from tritonclient.utils import np_to_triton_dtype

# Параметры
MODEL_NAME = "whisper_bls"
TRITON_URL = "localhost:8001"  # URL Triton Inference Server
SAMPLE_RATE = 16000  # Частота дискретизации аудио
AUDIO_DIR = "./audio"  # Папка с аудио
AUDIO_FILE_NAME = "Sound_2.mp3"  # Имя входного аудио файла
AUDIO_FILE_PATH = os.path.join(AUDIO_DIR, AUDIO_FILE_NAME)

# Инициализация клиента Triton
def create_triton_client():
    try:
        triton_client = grpcclient.InferenceServerClient(url=TRITON_URL)
        print("Triton client created successfully.")
        return triton_client
    except Exception as e:
        print(f"Failed to create Triton client: {e}")
        raise

# Преобразование MP3 в WAV с частотой дискретизации 16 kHz
def convert_mp3_to_wav(mp3_file_path):
    # Загрузка MP3 файла
    audio = AudioSegment.from_mp3(mp3_file_path)
    
    # Преобразование в WAV с частотой дискретизации 16 kHz
    audio = audio.set_frame_rate(SAMPLE_RATE).set_channels(1)  # Моно канал
    temp_wav_path = mp3_file_path.replace(".mp3", ".wav")
    audio.export(temp_wav_path, format="wav")
    print(f"Converted MP3 to WAV: {temp_wav_path}")
    return temp_wav_path

# Преобразование аудио в лог-мел спектрограмму
def preprocess_audio(wav_file_path):
    from librosa import load
    # Загрузка аудио файла
    audio_data, sample_rate = load(wav_file_path, sr=SAMPLE_RATE)
    
    # Преобразование аудио в лог-мел спектрограмму
    feature_extractor = WhisperFeatureExtractor.from_pretrained("openai/whisper-tiny")
    features = feature_extractor(audio_data, sampling_rate=SAMPLE_RATE, return_tensors="np").input_features
    
    # Вывод мел-спектограммы
    plot_mel_spectrogram(features[0])
    
    return features

# Визуализация мел-спектограммы
def plot_mel_spectrogram(mel_spectrogram):
    plt.figure(figsize=(10, 4))
    plt.imshow(mel_spectrogram, aspect="auto", origin="lower", cmap="viridis")
    plt.title("Mel Spectrogram")
    plt.xlabel("Time Frames")
    plt.ylabel("Mel Frequency Bins")
    plt.colorbar(format="%+2.0f dB")
    plt.show()

# Генерация начального токена для декодера
def generate_decoder_input():
    from transformers import WhisperProcessor
    processor = WhisperProcessor.from_pretrained("openai/whisper-tiny")
    decoder_input_ids = processor.tokenizer("<|startoftranscript|>", return_tensors="np").input_ids
    return decoder_input_ids

# Выполнение запроса к BLS модели через Triton
def run_inference(triton_client, audio_features, decoder_input_ids):
    # Подготовка входных данных
    inputs = [
        grpcclient.InferInput("audio_features", audio_features.shape, np_to_triton_dtype(audio_features.dtype)),
        grpcclient.InferInput("decoder_input", decoder_input_ids.shape, np_to_triton_dtype(decoder_input_ids.dtype))
    ]
    inputs[0].set_data_from_numpy(audio_features)
    inputs[1].set_data_from_numpy(decoder_input_ids)

    # Подготовка выходных данных
    outputs = [grpcclient.InferRequestedOutput("decoder_output")]

    # Выполнение запроса
    response = triton_client.infer(model_name=MODEL_NAME, inputs=inputs, outputs=outputs)
    decoder_output = response.as_numpy("decoder_output")
    return decoder_output

# Декодирование выходных данных в текст
def decode_output(decoder_output):
    from transformers import WhisperProcessor
    processor = WhisperProcessor.from_pretrained("openai/whisper-tiny")
    predicted_ids = np.argmax(decoder_output, axis=-1)
    transcription = processor.tokenizer.batch_decode(predicted_ids, skip_special_tokens=True)
    return transcription

# Основная функция
def main():
    # Создание клиента Triton
    triton_client = create_triton_client()

    # Преобразование MP3 в WAV
    wav_file_path = convert_mp3_to_wav(AUDIO_FILE_PATH)

    # Предобработка аудио
    print("Preprocessing audio...")
    audio_features = preprocess_audio(wav_file_path)

    # Генерация начального токена для декодера
    print("Generating decoder input...")
    decoder_input_ids = generate_decoder_input()

    # Выполнение вывода через Triton
    print("Running inference with BLS model...")
    decoder_output = run_inference(triton_client, audio_features, decoder_input_ids)

    # Декодирование результата
    print("Decoding output...")
    transcription = decode_output(decoder_output)
    print(f"Transcription: {transcription}")

if __name__ == "__main__":
    main()