import os
import numpy as np
import librosa
import tritonclient.grpc as grpcclient
from transformers import WhisperProcessor
import matplotlib.pyplot as plt
from pydub import AudioSegment

# Параметры
TRITON_SERVER_URL = "localhost:8001"
AUDIO_FILE_PATH = os.path.join("audio", "Sound_1.mp3")
MODEL_NAME_ENCODER = "whisper_encoder"
MODEL_NAME_DECODER = "whisper_decoder"

# Генерация имени временного WAV-файла
def generate_wav_filename(mp3_file):
    base_name = os.path.splitext(mp3_file)[0]
    return f"{base_name}.wav"

# Конвертация MP3 в WAV
def convert_mp3_to_wav(mp3_file, wav_file, target_sr=16000):
    print(f"Converting {mp3_file} to WAV...")
    audio = AudioSegment.from_mp3(mp3_file)
    audio = audio.set_frame_rate(target_sr)  # Установка частоты дискретизации
    audio.export(wav_file, format="wav")
    print(f"File successfully converted: {wav_file}")

# Загрузка процессора Whisper
print("Loading Whisper processor...")
processor = WhisperProcessor.from_pretrained("openai/whisper-tiny")

# Подключение к Triton Inference Server
print("Connecting to Triton Inference Server...")
triton_client = grpcclient.InferenceServerClient(url=TRITON_SERVER_URL)

# Загрузка и предварительная обработка аудио
def preprocess_audio(file_path):
    print(f"Loading audio file: {file_path}")
    # Загрузка аудио с помощью librosa
    audio_data, sample_rate = librosa.load(file_path, sr=16000)
    
    # Визуализация аудиосигнала
    plot_waveform(audio_data, sample_rate)
    
    # Преобразование аудио в лог-мел спектрограмму
    features = processor.feature_extractor(audio_data, sampling_rate=sample_rate, return_tensors="np").input_features
    
    # Визуализация спектрограммы
    plot_spectrogram(features[0])
    
    return features

# Функция для построения графика аудиосигнала
def plot_waveform(audio_data, sample_rate):
    print("Plotting waveform...")
    plt.figure(figsize=(14, 5))
    plt.plot(np.linspace(0, len(audio_data) / sample_rate, num=len(audio_data)), audio_data)
    plt.title("Waveform")
    plt.xlabel("Time (s)")
    plt.ylabel("Amplitude")
    plt.grid(True)
    plt.show()

# Функция для построения спектрограммы
def plot_spectrogram(spectrogram):
    print("Plotting spectrogram...")
    plt.figure(figsize=(14, 5))
    librosa.display.specshow(librosa.power_to_db(spectrogram, ref=np.max), y_axis='mel', x_axis='time', sr=16000, fmax=8000)
    plt.colorbar(format='%+2.0f dB')
    plt.title("Mel Spectrogram")
    plt.xlabel("Time (s)")
    plt.ylabel("Frequency (Hz)")
    plt.tight_layout()
    plt.show()

# Отправка данных в энкодер
def run_encoder(features):
    print("Running encoder inference...")
    inputs = [
        grpcclient.InferInput("audio_features", features.shape, "FP32")
    ]
    inputs[0].set_data_from_numpy(features.astype(np.float32))

    outputs = [
        grpcclient.InferRequestedOutput("encoder_output")
    ]

    response = triton_client.infer(MODEL_NAME_ENCODER, inputs, outputs=outputs)
    encoder_output = response.as_numpy("encoder_output")
    return encoder_output

# Отправка данных в декодер
def run_decoder(encoder_output):
    print("Running decoder inference...")
    # Инициализация входных токенов (начальный токен)
    decoder_input_ids = np.array([[50258]], dtype=np.int64)  # Токен начала последовательности
    eos_token_id = processor.tokenizer.eos_token_id  # Токен конца последовательности

    # Список для хранения сгенерированных токенов
    generated_tokens = []

    # Максимальная длина последовательности
    max_length = 100

    # Цикл декодирования
    for _ in range(max_length):
        inputs = [
            grpcclient.InferInput("decoder_input", decoder_input_ids.shape, "INT64"),
            grpcclient.InferInput("encoder_output", encoder_output.shape, "FP32")
        ]
        inputs[0].set_data_from_numpy(decoder_input_ids)
        inputs[1].set_data_from_numpy(encoder_output.astype(np.float32))

        outputs = [
            grpcclient.InferRequestedOutput("decoder_output")
        ]

        response = triton_client.infer(MODEL_NAME_DECODER, inputs, outputs=outputs)
        decoder_output = response.as_numpy("decoder_output")

        # Выбор наиболее вероятного токена
        predicted_token = np.argmax(decoder_output[:, -1, :], axis=-1)
        generated_tokens.append(predicted_token[0])

        print(f"Predicted token: {predicted_token[0]}, Decoded: {processor.tokenizer.decode([predicted_token[0]])}")

        # Проверка на достижение токена конца последовательности
        if predicted_token[0] == eos_token_id:
            break

        # Обновление входных данных для следующего шага
        decoder_input_ids = np.hstack((decoder_input_ids, [[predicted_token[0]]]))

    return np.array(generated_tokens, dtype=np.int64)

# Декодирование выходных данных в текст
def decode_output(generated_tokens):
    print("Decoding output...")
    transcription = processor.tokenizer.decode(generated_tokens, skip_special_tokens=True)
    return transcription

# Основная функция
def main():
    try:
        # Конвертация MP3 в WAV
        wav_file = generate_wav_filename(AUDIO_FILE_PATH)
        convert_mp3_to_wav(AUDIO_FILE_PATH, wav_file)

        # Предварительная обработка аудио
        audio_features = preprocess_audio(wav_file)
        print("Audio features shape:", audio_features.shape)

        # Выполнение инференса через энкодер
        encoder_output = run_encoder(audio_features)

        # Выполнение инференса через декодер
        generated_tokens = run_decoder(encoder_output)

        # Декодирование результата
        transcription = decode_output(generated_tokens)

        # Вывод транскрипции
        print("Transcription:")
        print(transcription)

    finally:
        # Удаление временного WAV-файла
        if os.path.exists(wav_file):
            print(f"Removing temporary WAV file: {wav_file}")
            os.remove(wav_file)

if __name__ == "__main__":
    main()