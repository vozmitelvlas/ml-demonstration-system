import os
import librosa
import numpy as np
import matplotlib.pyplot as plt
from pydub import AudioSegment
from transformers import Wav2Vec2Processor
import tritonclient.grpc as grpcclient
from tritonclient.utils import np_to_triton_dtype


class AudioProcessor:
    def __init__(self, mp3_file, triton_url="localhost:8001", model_name="wav2vec2", target_sr=16000):
        """
        Инициализация процессора аудио.

        :param mp3_file: Путь к входному MP3-файлу.
        :param triton_url: URL Triton Inference Server (например, "localhost:8001").
        :param model_name: Имя модели, развернутой на Triton.
        :param target_sr: Целевая частота дискретизации (по умолчанию 16000 Гц).
        """
        self.mp3_file = mp3_file
        self.triton_url = triton_url
        self.model_name = model_name
        self.target_sr = target_sr
        self.wav_file = self._generate_wav_filename()
        self.processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
        self.waveform = None
        self.sr = None
        self.triton_client = grpcclient.InferenceServerClient(url=triton_url)

    def _generate_wav_filename(self):
        """Генерация имени временного WAV-файла."""
        base_name = os.path.splitext(self.mp3_file)[0]
        return f"{base_name}.wav"

    def convert_mp3_to_wav(self):
        """Конвертация MP3 в WAV."""
        if not os.path.exists(self.mp3_file):
            raise FileNotFoundError(f"Файл {self.mp3_file} не найден.")
        print(f"Конвертация файла {self.mp3_file} в WAV...")
        audio = AudioSegment.from_mp3(self.mp3_file)
        audio.export(self.wav_file, format="wav")
        print(f"Файл успешно конвертирован: {self.wav_file}")

    def load_and_preprocess_audio(self):
        """Загрузка и предобработка аудио."""
        if not os.path.exists(self.wav_file):
            raise FileNotFoundError(f"Файл {self.wav_file} не найден.")
        print(f"Загрузка и предобработка аудио: {self.wav_file}")
        waveform, sr = librosa.load(self.wav_file, sr=self.target_sr)
        waveform = waveform.astype(np.float32)
        self.waveform = waveform
        self.sr = sr

    def transcribe_audio_with_triton(self):
        """Использование модели на Triton для распознавания текста."""
        if not self.triton_client.is_server_live():
            raise ConnectionError(f"Triton Server на {self.triton_url} недоступен.")

        print(f"Отправка запроса к модели {self.model_name} на Triton...")

        # Подготовка входных данных
        input_data = self.waveform.reshape(1, -1).astype(np.float32)
        inputs = [
            grpcclient.InferInput("input", input_data.shape, np_to_triton_dtype(input_data.dtype))
        ]
        inputs[0].set_data_from_numpy(input_data)

        # Подготовка выходных данных
        outputs = [grpcclient.InferRequestedOutput("output")]

        # Выполнение инференса
        response = self.triton_client.infer(model_name=self.model_name, inputs=inputs, outputs=outputs)
        logits = response.as_numpy("output")

        # Декодирование выходных данных
        predicted_ids = np.argmax(logits, axis=-1)
        transcription = self.processor.tokenizer.decode(predicted_ids[0])
        return transcription

    def plot_waveform_and_spectrogram(self):
        """Построение графиков и спектрограммы."""
        print("Построение графиков и спектрограммы...")
        plt.figure(figsize=(12, 6))

        # График аудиосигнала
        plt.subplot(2, 1, 1)
        time = np.arange(len(self.waveform)) / self.sr
        plt.plot(time, self.waveform)
        plt.title("Waveform")
        plt.xlabel("Time (s)")
        plt.ylabel("Amplitude")

        # Спектрограмма
        plt.subplot(2, 1, 2)
        D = librosa.amplitude_to_db(np.abs(librosa.stft(self.waveform)), ref=np.max)
        librosa.display.specshow(D, sr=self.sr, x_axis='time', y_axis='log')
        plt.colorbar(format='%+2.0f dB')
        plt.title("Spectrogram")
        plt.tight_layout()
        plt.show()

    def cleanup(self):
        """Удаление временного WAV-файла."""
        if os.path.exists(self.wav_file):
            print(f"Удаление временного WAV-файла: {self.wav_file}")
            os.remove(self.wav_file)

    def process(self):
        """Основной метод для выполнения всех шагов."""
        try:
            # Шаг 1: Конвертация MP3 в WAV
            self.convert_mp3_to_wav()

            # Шаг 2: Загрузка и предобработка аудио
            self.load_and_preprocess_audio()

            # Шаг 3: Распознавание текста с помощью модели на Triton
            transcription = self.transcribe_audio_with_triton()
            print("Transcription:", transcription)

            # Шаг 4: Построение графиков и спектрограммы
            self.plot_waveform_and_spectrogram()

        except Exception as e:
            print(f"Ошибка: {e}")
        finally:
            # Удаление временного WAV-файла
            self.cleanup()


# Пример использования
if __name__ == "__main__":
    mp3_file = "./audio/Sound_1.mp3"
    triton_url = "localhost:8001"  # URL Triton Inference Server
    model_name = "wav2vec2"  # Имя модели, развернутой на Triton

    processor = AudioProcessor(mp3_file=mp3_file, triton_url=triton_url, model_name=model_name)
    processor.process()