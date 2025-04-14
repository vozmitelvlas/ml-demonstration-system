# integrated_whisper_processor.py
import os
import numpy as np
import torch
import onnxruntime as ort
from transformers import WhisperProcessor, WhisperForConditionalGeneration


class WhisperExporter:
    def __init__(self, model_name="openai/whisper-tiny", model_repository_path="./model_repository", triton_version="1"):
        """
        Инициализация класса для экспорта моделей Whisper.
        """
        self.model_name = model_name
        self.model_repository_path = model_repository_path
        self.triton_version = triton_version
        self.model = None
        self.processor = None

    def load_model(self):
        """
        Загружает модель Whisper и процессор.
        """
        print(f"Загрузка модели Whisper: {self.model_name}")
        self.model = WhisperForConditionalGeneration.from_pretrained(self.model_name)
        self.processor = WhisperProcessor.from_pretrained(self.model_name)

    def export_encoder(self, encoder_dir):
        """
        Экспортирует encoder в формат ONNX.
        """
        print("Экспорт encoder...")
        encoder_input = torch.randn(1, 80, 3000)  # Пример входных данных для encoder
        encoder_path = os.path.join(encoder_dir, "model.onnx")
        torch.onnx.export(
            self.model.model.encoder,
            encoder_input,
            encoder_path,
            input_names=["mel"],
            output_names=["encoder_hidden_states"],
            dynamic_axes={
                "mel": {0: "batch_size", 2: "sequence_length"},
                "encoder_hidden_states": {0: "batch_size", 1: "sequence_length"}
            },
            opset_version=14
        )
        print(f"Encoder экспортирован: {encoder_path}")

    def export_decoder(self, decoder_dir):
        """
        Экспортирует decoder в формат ONNX.
        """
        print("Экспорт decoder...")
        decoder_input_ids = torch.randint(0, self.model.config.vocab_size, (1, 10))  # Пример входных данных для decoder
        encoder_hidden_states = torch.randn(1, 10, self.model.config.d_model)  # Выход encoder
        decoder_path = os.path.join(decoder_dir, "model.onnx")
        torch.onnx.export(
            self.model.model.decoder,
            (decoder_input_ids, encoder_hidden_states),
            decoder_path,
            input_names=["decoder_input_ids", "encoder_hidden_states"],
            output_names=["logits"],
            dynamic_axes={
                "decoder_input_ids": {0: "batch_size", 1: "sequence_length"},
                "encoder_hidden_states": {0: "batch_size", 1: "sequence_length"},
                "logits": {0: "batch_size", 1: "sequence_length"}
            },
            opset_version=14
        )
        print(f"Decoder экспортирован: {decoder_path}")

    def create_triton_config(self, model_dir, model_name, sampling_rate=None, d_model=None, vocab_size=None):
        """
        Создает конфигурационный файл для Triton.
        """
        if model_name == "whisper_encoder":
            config_content = f"""
name: "{model_name}"
platform: "onnxruntime_onnx"
max_batch_size: 0
input [
    {{
        name: "mel"  
        data_type: TYPE_FP32
        dims: [-1, 80]
    }}
]
output [
    {{
        name: "encoder_hidden_states"
        data_type: TYPE_FP32
        dims: [-1, {d_model}]
    }}
]
instance_group [
    {{
        kind: KIND_CPU  # Используем CPU вместо GPU
        count: 1
    }}
]
"""
        elif model_name == "whisper_decoder":
            config_content = f"""
name: "{model_name}"
platform: "onnxruntime_onnx"
max_batch_size: 0
input [
    {{
        name: "decoder_input_ids"
        data_type: TYPE_INT64
        dims: [-1]
    }},
    {{
        name: "encoder_hidden_states"
        data_type: TYPE_FP32
        dims: [-1, {d_model}]
    }}
]
output [
    {{
        name: "logits"
        data_type: TYPE_FP32
        dims: [-1, {vocab_size}]
    }}
]
instance_group [
    {{
        kind: KIND_CPU  # Используем CPU вместо GPU
        count: 1
    }}
]
"""

        config_path = os.path.join(model_dir, "config.pbtxt")
        with open(config_path, "w") as f:
            f.write(config_content.strip())
        print(f"Конфигурационный файл создан: {config_path}")

    def test_encoder(self, encoder_path):
        """
        Тестирует экспортированную модель encoder.
        """
        print("Тестирование encoder...")
        encoder_session = ort.InferenceSession(encoder_path)

        # Пример входных данных
        encoder_input = np.random.randn(1, 80, 3000).astype(np.float32)  # Форма: (batch_size, num_features, sequence_length)

        # Выполнение инференса
        encoder_outputs = encoder_session.run(None, {"mel": encoder_input})

        # Проверка выходных данных
        print("Форма выходных данных encoder:", encoder_outputs[0].shape)
        assert len(encoder_outputs[0].shape) == 3, "Некорректная форма выходных данных encoder"

    def test_decoder(self, decoder_path):
        """
        Тестирует экспортированную модель decoder.
        """
        print("Тестирование decoder...")
        decoder_session = ort.InferenceSession(decoder_path)

        # Пример входных данных
        decoder_input_ids = np.random.randint(0, self.model.config.vocab_size, (1, 10)).astype(np.int64)  # Форма: (batch_size, sequence_length)
        encoder_hidden_states = np.random.randn(1, 10, self.model.config.d_model).astype(np.float32)  # Форма: (batch_size, sequence_length, d_model)

        # Выполнение инференса
        decoder_outputs = decoder_session.run(None, {
            "decoder_input_ids": decoder_input_ids,
            "encoder_hidden_states": encoder_hidden_states
        })

        # Проверка выходных данных
        print("Форма выходных данных decoder:", decoder_outputs[0].shape)
        assert len(decoder_outputs[0].shape) == 3, "Некорректная форма выходных данных decoder"

    def export_to_triton(self):
        """
        Экспортирует модели encoder и decoder Whisper в формат ONNX и создает структуру для Triton.
        """
        # Создаем папку model_repository, если она не существует
        os.makedirs(self.model_repository_path, exist_ok=True)

        # Загружаем модель Whisper
        self.load_model()

        # Определяем пути для encoder и decoder
        encoder_dir = os.path.join(self.model_repository_path, "whisper_encoder", self.triton_version)
        decoder_dir = os.path.join(self.model_repository_path, "whisper_decoder", self.triton_version)

        # Создаем папки для моделей
        os.makedirs(encoder_dir, exist_ok=True)
        os.makedirs(decoder_dir, exist_ok=True)

        # Экспорт encoder
        self.export_encoder(encoder_dir)

        # Тестирование encoder
        print("Тестирование encoder...")
        encoder_path = os.path.join(encoder_dir, "model.onnx")
        self.test_encoder(encoder_path)

        # Экспорт decoder
        self.export_decoder(decoder_dir)

        # Тестирование decoder
        print("Тестирование decoder...")
        decoder_path = os.path.join(decoder_dir, "model.onnx")
        self.test_decoder(decoder_path)

        # Создание конфигурационных файлов для Triton
        self.create_triton_config(encoder_dir, "whisper_encoder", self.processor.feature_extractor.sampling_rate, self.model.config.d_model)
        self.create_triton_config(decoder_dir, "whisper_decoder", d_model=self.model.config.d_model, vocab_size=self.model.config.vocab_size)

        print("Интеграция завершена. Модели готовы для использования в Triton.")


if __name__ == "__main__":
    # Шаг 1: Генерация ONNX-моделей
    exporter = WhisperExporter()
    exporter.export_to_triton()