import os
import torch
import numpy as np
from datasets import load_dataset
from transformers import WhisperModel, WhisperFeatureExtractor, WhisperProcessor

# Параметры
MODEL_NAME = "openai/whisper-tiny"
MODEL_REPO_DIR = "./model_repository"

# Пути к модели
BLS_DIR = os.path.join(MODEL_REPO_DIR, "whisper_bls")
ONNX_BLS_PATH = os.path.join(BLS_DIR, "1", "model.onnx")

# Создание структуры папок
def create_model_repository():
    os.makedirs(os.path.join(BLS_DIR, "1"), exist_ok=True)
    print("BLS model structure created.")

# Экспорт BLS модели в ONNX
def export_bls_to_onnx(model):
    # Загрузка реального аудио из датасета
    dataset = load_dataset("librispeech_asr", split="test.clean", streaming=True)
    sample = next(iter(dataset))
    audio_data = sample["audio"]["array"]
    sample_rate = sample["audio"]["sampling_rate"]

    # Преобразование аудио в лог-мел спектрограмму
    features = feature_extractor(audio_data, sampling_rate=sample_rate, return_tensors="pt").input_features

    # Генерация примера текстовых токенов
    text = "This is a test transcription."
    tokenized_text = processor.tokenizer(text, return_tensors="pt").input_ids

    # Определение упрощенного класса для BLS
    class BLSModel(torch.nn.Module):
        def __init__(self, model):
            super().__init__()
            self.model = model

        def forward(self, audio_features, decoder_input_ids):
            # Вызов энкодера
            encoder_hidden_states = self.model.encoder(audio_features)

            # Вызов декодера
            decoder_outputs = self.model.decoder(
                input_ids=decoder_input_ids,
                encoder_hidden_states=encoder_hidden_states.last_hidden_state
            )
            return decoder_outputs.last_hidden_state

    # Инициализация BLS модели
    bls_model = BLSModel(model)

    # Экспорт BLS модели в ONNX
    dummy_audio_features = torch.randn(1, 80, 3000)  # Пример входных данных для энкодера
    dummy_decoder_input_ids = torch.tensor([[50257]])  # Пример начального токена для декодера

    torch.onnx.export(
        bls_model,
        (dummy_audio_features, dummy_decoder_input_ids),
        ONNX_BLS_PATH,
        input_names=["audio_features", "decoder_input"],
        output_names=["decoder_output"],
        dynamic_axes={
            "audio_features": {0: "batch_size", 2: "sequence_length"},
            "decoder_input": {0: "batch_size", 1: "sequence_length"},
            "decoder_output": {0: "batch_size", 1: "sequence_length"}
        },
        opset_version=15,
        verbose=True
    )
    print(f"BLS model exported to {ONNX_BLS_PATH}")

# Генерация config.pbtxt для BLS модели
def generate_bls_config():
    config_content = """
name: "whisper_bls"
platform: "onnxruntime_onnx"
max_batch_size: 0
input [
  {
    name: "audio_features"
    data_type: TYPE_FP32
    dims: [-1, 80, -1]
  },
  {
    name: "decoder_input"
    data_type: TYPE_INT64
    dims: [-1, -1]
  }
]
output [
  {
    name: "decoder_output"
    data_type: TYPE_FP32
    dims: [-1, -1, 384]
  }
]
instance_group [
  {
    kind: KIND_CPU
    count: 1
  }
]
"""
    with open(os.path.join(BLS_DIR, "config.pbtxt"), "w") as f:
        f.write(config_content)
    print(f"BLS config.pbtxt created at {os.path.join(BLS_DIR, 'config.pbtxt')}")

# Основная функция
def main():
    # Загрузка модели
    print("Loading Whisper Tiny model...")
    model = WhisperModel.from_pretrained(MODEL_NAME)
    global feature_extractor, processor
    feature_extractor = WhisperFeatureExtractor.from_pretrained(MODEL_NAME)
    processor = WhisperProcessor.from_pretrained(MODEL_NAME)

    # Создание структуры папок
    print("Creating model repository structure...")
    create_model_repository()

    # Экспорт BLS модели в ONNX
    print("Exporting BLS model to ONNX...")
    export_bls_to_onnx(model)

    # Генерация конфигурационных файлов
    print("Generating BLS config.pbtxt...")
    generate_bls_config()

    print("All tasks completed successfully!")

if __name__ == "__main__":
    main()