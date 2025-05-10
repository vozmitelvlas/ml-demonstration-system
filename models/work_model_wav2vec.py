import os
import librosa
import numpy as np
import matplotlib.pyplot as plt
from pydub import AudioSegment
from transformers import Wav2Vec2Processor
import tritonclient.http as httpclient
from tritonclient.utils import np_to_triton_dtype
import time
import jiwer


class AudioProcessor:
    def __init__(self, mp3_file, reference_text, triton_url="localhost:8000", model_name="wav2vec2", target_sr=16000):
        """
        Инициализация процессора аудио.

        :param mp3_file: Путь к входному MP3-файлу.
        :param reference_text: Эталонный текст для сравнения.
        :param triton_url: URL Triton Inference Server.
        :param model_name: Имя модели на сервере.
        :param target_sr: Целевая частота дискретизации.
        """
        self.mp3_file = mp3_file
        self.reference_text = reference_text
        self.triton_url = triton_url
        self.model_name = model_name
        self.target_sr = target_sr
        self.wav_file = self._generate_wav_filename()
        self.processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
        self.waveform = None
        self.sr = None
        self.triton_client = httpclient.InferenceServerClient(url=triton_url)
        self.timing_data = {}

    def _generate_wav_filename(self):
        """Генерация имени временного WAV-файла."""
        base_name = os.path.splitext(self.mp3_file)[0]
        return f"{base_name}.wav"

    def convert_mp3_to_wav(self):
        """Конвертация MP3 в WAV."""
        start_time = time.time()

        if not os.path.exists(self.mp3_file):
            raise FileNotFoundError(f"Файл {self.mp3_file} не найден.")
        print(f"Конвертация файла {self.mp3_file} в WAV...")
        audio = AudioSegment.from_mp3(self.mp3_file)
        audio.export(self.wav_file, format="wav")
        print(f"Файл успешно конвертирован: {self.wav_file}")

        end_time = time.time()
        self.timing_data['convert_mp3_to_wav'] = end_time - start_time

    def load_and_preprocess_audio(self):
        """Загрузка и предобработка аудио."""
        start_time = time.time()

        if not os.path.exists(self.wav_file):
            raise FileNotFoundError(f"Файл {self.wav_file} не найден.")
        print(f"Загрузка и предобработка аудио: {self.wav_file}")
        waveform, sr = librosa.load(self.wav_file, sr=self.target_sr)
        self.waveform = waveform.astype(np.float32)
        self.sr = sr

        end_time = time.time()
        self.timing_data['load_and_preprocess_audio'] = end_time - start_time

    def transcribe_audio_with_triton(self):
        """Использование модели на Triton через HTTP для распознавания текста."""
        start_time = time.time()

        if not self.triton_client.is_server_live():
            raise ConnectionError(f"Triton Server на {self.triton_url} недоступен.")

        print(f"Отправка запроса к модели {self.model_name} на Triton...")

        input_data = self.waveform.reshape(1, -1).astype(np.float32)

        # Создаем входной тензор
        inputs = [
            httpclient.InferInput("input", input_data.shape, np_to_triton_dtype(input_data.dtype))
        ]
        inputs[0].set_data_from_numpy(input_data)

        outputs = [
            httpclient.InferRequestedOutput("output")
        ]

        # Выполняем инференс
        response = self.triton_client.infer(model_name=self.model_name, inputs=inputs, outputs=outputs)
        logits = response.as_numpy("output")

        predicted_ids = np.argmax(logits, axis=-1)
        self.transcription = self.processor.tokenizer.decode(predicted_ids[0])

        end_time = time.time()
        self.timing_data['transcribe_audio_with_triton'] = end_time - start_time

    def evaluate_transcription(self):
        """Вычисление WER и CER."""
        wer = jiwer.wer(self.reference_text, self.transcription)
        cer = jiwer.cer(self.reference_text, self.transcription)
        print("\n📊 Оценка качества транскрипции:")
        print(f"Word Error Rate (WER): {wer:.4f}")
        print(f"Character Error Rate (CER): {cer:.4f}")
        return wer, cer

    def plot_waveform_and_spectrogram(self):
        """Построение графиков и спектрограммы."""
        print("Построение графиков и спектрограммы...")
        plt.figure(figsize=(12, 6))

        # График аудиосигнала
        plt.subplot(2, 1, 1)
        time_axis = np.arange(len(self.waveform)) / self.sr
        plt.plot(time_axis, self.waveform)
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
            total_start_time = time.time()

            # Шаг 1: Конвертация MP3 в WAV
            self.convert_mp3_to_wav()

            # Шаг 2: Загрузка и предобработка аудио
            self.load_and_preprocess_audio()

            # Шаг 3: Распознавание текста
            self.transcribe_audio_with_triton()
            print("Transcription:", self.transcription)

            # Шаг 4: Оценка качества
            #self.evaluate_transcription()

            # Шаг 5: Визуализация
            self.plot_waveform_and_spectrogram()

            total_end_time = time.time()
            self.timing_data['total_processing_time'] = total_end_time - total_start_time

            # Вывод времени работы
            print("\n⏱️ Время выполнения этапов:")
            for step, duration in self.timing_data.items():
                print(f"- {step}: {duration:.4f} сек.")

        except Exception as e:
            print(f"Ошибка: {e}")
        finally:
            self.cleanup()


# Пример использования
if __name__ == "__main__":
    mp3_file = "./audio/Sound_5.mp3"
    triton_url = "localhost:8000"
    model_name = "wav2vec2"
    reference_text = "WHO IS THAT BOY OVER THERE HANNA THAT UH THAT'S MY BROTHER JAM YOUR BROTHER YES AND THAT'S HIS GIRLFRIEND LUCY THE PRETTY GIRL WITH THE LONG BROWN HAIR"

    processor = AudioProcessor(
        mp3_file=mp3_file,
        reference_text=reference_text,
        triton_url=triton_url,
        model_name=model_name
    )
    processor.process()