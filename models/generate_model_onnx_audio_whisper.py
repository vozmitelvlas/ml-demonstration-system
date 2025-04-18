import os
import torch
from datasets import load_dataset
from transformers import WhisperModel, WhisperFeatureExtractor, WhisperProcessor
import onnxruntime as ort
import numpy as np

# Параметры
MODEL_NAME = "openai/whisper-tiny"
MODEL_REPO_DIR = "./model_repository"
ENCODER_DIR = os.path.join(MODEL_REPO_DIR, "whisper_encoder")
DECODER_DIR = os.path.join(MODEL_REPO_DIR, "whisper_decoder")
ONNX_ENCODER_PATH = os.path.join(ENCODER_DIR, "1", "model.onnx")
ONNX_DECODER_PATH = os.path.join(DECODER_DIR, "1", "model.onnx")

# Создание структуры папок
def create_model_repository():
    os.makedirs(os.path.join(ENCODER_DIR, "1"), exist_ok=True)
    os.makedirs(os.path.join(DECODER_DIR, "1"), exist_ok=True)

# Экспорт энкодера в ONNX
def export_encoder_to_onnx(model):
    # Загрузка реального аудио из датасета
    dataset = load_dataset("librispeech_asr", split="test.clean", streaming=True)
    sample = next(iter(dataset))
    audio_data = sample["audio"]["array"]
    sample_rate = sample["audio"]["sampling_rate"]

    # Преобразование аудио в лог-мел спектрограмму
    features = feature_extractor(audio_data, sampling_rate=sample_rate, return_tensors="pt").input_features

    # Экспорт энкодера
    torch.onnx.export(
        model.encoder,
        features,
        ONNX_ENCODER_PATH,
        input_names=["audio_features"],
        output_names=["encoder_output"],
        dynamic_axes={
            "audio_features": {0: "batch_size", 2: "sequence_length"},  # Динамическая длина аудио
            "encoder_output": {0: "batch_size", 1: "sequence_length"}   # Динамическая длина выхода
        },
        opset_version=15,  # Обновленная версия ONNX
        verbose=True
    )
    print(f"Encoder exported to {ONNX_ENCODER_PATH}")

    # Проверка экспорта
    ort_session = ort.InferenceSession(ONNX_ENCODER_PATH)
    onnx_inputs = {"audio_features": features.numpy()}
    onnx_outputs = ort_session.run(None, onnx_inputs)
    print(f"ONNX encoder output shape: {onnx_outputs[0].shape}")

# Экспорт декодера в ONNX
def export_decoder_to_onnx(model):
    # Загрузка реального аудио из датасета
    dataset = load_dataset("librispeech_asr", split="test.clean", streaming=True)
    sample = next(iter(dataset))
    audio_data = sample["audio"]["array"]
    sample_rate = sample["audio"]["sampling_rate"]

    # Преобразование аудио в лог-мел спектрограмму
    features = feature_extractor(audio_data, sampling_rate=sample_rate, return_tensors="pt").input_features

    # Получение выхода энкодера
    encoder_hidden_states = model.encoder(features)

    # Генерация примера текстовых токенов
    text = "This is a test transcription."
    tokenized_text = processor.tokenizer(text, return_tensors="pt").input_ids

    # Упрощенный декодер без кэширования
    class SimplifiedDecoder(torch.nn.Module):
        def __init__(self, decoder):
            super().__init__()
            self.decoder = decoder

        def forward(self, decoder_input_ids, encoder_hidden_states):
            return self.decoder(
                input_ids=decoder_input_ids,
                encoder_hidden_states=encoder_hidden_states,
                past_key_values=None
            ).last_hidden_state

    simplified_decoder = SimplifiedDecoder(model.decoder)

    # Экспорт упрощенного декодера
    torch.onnx.export(
        simplified_decoder,
        (tokenized_text, encoder_hidden_states.last_hidden_state),
        ONNX_DECODER_PATH,
        input_names=["decoder_input", "encoder_output"],
        output_names=["decoder_output"],
        dynamic_axes={
            "decoder_input": {0: "batch_size", 1: "sequence_length"},
            "encoder_output": {0: "batch_size", 1: "sequence_length"},
            "decoder_output": {0: "batch_size", 1: "sequence_length"}
        },
        opset_version=15,  # Обновленная версия ONNX
        verbose=True
    )
    print(f"Decoder exported to {ONNX_DECODER_PATH}")

    # Проверка экспорта
    ort_session = ort.InferenceSession(ONNX_DECODER_PATH)
    onnx_inputs = {
        "decoder_input": tokenized_text.numpy(),
        "encoder_output": encoder_hidden_states.last_hidden_state.detach().numpy()  # Используем detach()
    }
    onnx_outputs = ort_session.run(None, onnx_inputs)
    print(f"ONNX decoder output shape: {onnx_outputs[0].shape}")

# Генерация config.pbtxt для энкодера
def generate_encoder_config():
    config_content = """
name: "whisper_encoder"
platform: "onnxruntime_onnx"
max_batch_size: 0
input [
  {
    name: "audio_features"
    data_type: TYPE_FP32
    dims: [-1, 80, -1]
  }
]
output [
  {
    name: "encoder_output"
    data_type: TYPE_FP32
    dims: [-1, 1500, 384]  # Динамическая длина последовательности
  }
]
instance_group [
  {
    kind: KIND_CPU
    count: 1
  }
]
"""
    with open(os.path.join(ENCODER_DIR, "config.pbtxt"), "w") as f:
        f.write(config_content)
    print(f"Encoder config.pbtxt created at {os.path.join(ENCODER_DIR, 'config.pbtxt')}")

# Генерация config.pbtxt для декодера
def generate_decoder_config():
    config_content = """
name: "whisper_decoder"
platform: "onnxruntime_onnx"
max_batch_size: 0
input [
  {
    name: "decoder_input"
    data_type: TYPE_INT64
    dims: [-1, -1]
  },
  {
    name: "encoder_output"
    data_type: TYPE_FP32
    dims: [-1, -1, 384]
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
    with open(os.path.join(DECODER_DIR, "config.pbtxt"), "w") as f:
        f.write(config_content)
    print(f"Decoder config.pbtxt created at {os.path.join(DECODER_DIR, 'config.pbtxt')}")

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

    # Экспорт моделей в ONNX
    print("Exporting encoder to ONNX...")
    export_encoder_to_onnx(model)

    print("Exporting decoder to ONNX...")
    export_decoder_to_onnx(model)

    # Генерация конфигурационных файлов
    print("Generating encoder config.pbtxt...")
    generate_encoder_config()

    print("Generating decoder config.pbtxt...")
    generate_decoder_config()

    print("All tasks completed successfully!")

if __name__ == "__main__":
    main()