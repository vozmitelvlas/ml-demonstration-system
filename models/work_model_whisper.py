# audio_processor_onnx.py
import os
import librosa
import numpy as np
import matplotlib.pyplot as plt
import onnxruntime as ort
from transformers import WhisperProcessor

class AudioProcessorONNX:
    def __init__(self, encoder_path="./model_repository/whisper_encoder/1/model.onnx", 
                 decoder_path="./model_repository/whisper_decoder/1/model.onnx", 
                 model_name="openai/whisper-tiny"):
        """
        Инициализация класса для обработки аудио с использованием ONNX-моделей.
        """
        self.encoder_path = encoder_path
        self.decoder_path = decoder_path
        self.model_name = model_name
        self.processor = None
        self.encoder_session = None
        self.decoder_session = None

    def load_model(self):
        """
        Загружает процессор Whisper и ONNX-модели.
        """
        print("Загрузка процессора Whisper...")
        self.processor = WhisperProcessor.from_pretrained(self.model_name)

        print(f"Загрузка ONNX-модели Encoder: {self.encoder_path}")
        self.encoder_session = ort.InferenceSession(self.encoder_path)

        print(f"Загрузка ONNX-модели Decoder: {self.decoder_path}")
        self.decoder_session = ort.InferenceSession(self.decoder_path)

    def load_audio(self, audio_path):
        """
        Загружает аудиофайл и преобразует его в формат, подходящий для модели.
        """
        print(f"Загрузка аудио: {audio_path}")
        waveform, sample_rate = librosa.load(audio_path, sr=self.processor.feature_extractor.sampling_rate)
        return waveform, sample_rate

    def generate_spectrogram(self, waveform, sample_rate, output_path="spectrogram.png"):
        """
        Генерирует спектограмму аудиофайла и сохраняет её как изображение.
        """
        print(f"Генерация спектограммы: {output_path}")
        spectrogram = librosa.stft(waveform)
        spectrogram_db = librosa.amplitude_to_db(np.abs(spectrogram))

        plt.figure(figsize=(10, 4))
        librosa.display.specshow(spectrogram_db, sr=sample_rate, x_axis='time', y_axis='hz')
        plt.colorbar(format='%+2.0f dB')
        plt.title('Spectrogram')
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        print(f"Спектограмма сохранена: {output_path}")

    def visualize_waveform(self, waveform, sample_rate, output_path="waveform.png"):
        """
        Визуализирует форму волны аудиофайла и сохраняет её как изображение.
        """
        print(f"Генерация формы волны: {output_path}")
        plt.figure(figsize=(10, 4))
        librosa.display.waveshow(waveform, sr=sample_rate)
        plt.title('Waveform')
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        print(f"Форма волны сохранена: {output_path}")

    def preprocess_audio(self, waveform):
        """
        Преобразует аудиосигнал в mel-спектрограмму для подачи в модель.
        """
        print("Предобработка аудио...")
        input_features = self.processor(waveform, sampling_rate=self.processor.feature_extractor.sampling_rate, return_tensors="np").input_features
        return input_features

    def run_encoder(self, mel_input):
        """
        Выполняет инференс через ONNX-модель Encoder.
        """
        print("Выполнение инференса Encoder...")
        encoder_inputs = {"mel": mel_input}
        encoder_outputs = self.encoder_session.run(None, encoder_inputs)
        encoder_hidden_states = encoder_outputs[0]  # Получаем скрытые состояния encoder
        return encoder_hidden_states

    def run_decoder(self, decoder_input_ids, encoder_hidden_states):
        """
        Выполняет инференс через ONNX-модель Decoder.
        """
        print("Выполнение инференса Decoder...")
        
        # Проверка размерности encoder_hidden_states
        print(f"Форма encoder_hidden_states: {encoder_hidden_states.shape}")
        
        # Изменение формы encoder_hidden_states, если необходимо
        if encoder_hidden_states.shape != (1, 1, 1, 384):  # Пример ожидаемой формы
            encoder_hidden_states = encoder_hidden_states[:, :1, :]  # Обрезаем до 1 шага
            encoder_hidden_states = encoder_hidden_states.reshape(1, 1, 384)
            print(f"Изменена форма encoder_hidden_states на: {encoder_hidden_states.shape}")
        
        # Подготовка decoder_input_ids: преобразуем в массив NumPy
        decoder_input_ids = np.array(decoder_input_ids).astype(np.int64)
        
        # Подготовка входных данных для Decoder
        decoder_inputs = {
            "decoder_input_ids": decoder_input_ids,
            "encoder_hidden_states": encoder_hidden_states
        }
        
        # Выполнение инференса Decoder
        decoder_outputs = self.decoder_session.run(None, decoder_inputs)
        return decoder_outputs[0]  # Возвращаем logits

    def transcribe_audio(self, waveform):
        """
        Выполняет транскрипцию аудиофайла с использованием ONNX-моделей.
        """
        print("Выполнение транскрипции...")
        # Предобработка аудио
        mel_input = self.preprocess_audio(waveform)

        # Инференс Encoder
        encoder_hidden_states = self.run_encoder(mel_input)

        # Подготовка входных данных для Decoder
        sot_token_id = self.processor.tokenizer.convert_tokens_to_ids("<|startoftranscript|>")  # Start of transcription token
        decoder_input_ids = [[sot_token_id]]  # Токен начала транскрипции

        logits = self.run_decoder(decoder_input_ids, encoder_hidden_states)

        # Декодирование выходных данных
        predicted_ids = np.argmax(logits, axis=-1)
        transcription = self.processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        print(f"Транскрипция: {transcription}")
        return transcription




if __name__ == "__main__":
    # Создаем экземпляр класса
    processor = AudioProcessorONNX()

    # Загрузка модели
    processor.load_model()

    # Путь к аудиофайлу
    audio_path = "./audio/Sound_2.mp3"

    # Загрузка аудио
    waveform, sample_rate = processor.load_audio(audio_path)

    # Транскрипция аудио
    processor.transcribe_audio(waveform)