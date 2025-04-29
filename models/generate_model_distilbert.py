import os
import torch
from transformers import AutoModel, AutoTokenizer


# === Шаг 1: Конвертация модели в ONNX ===
def export_model_to_onnx(output_path="tinybert.onnx"):
    print("Exporting model to ONNX...")
    model_name = "huawei-noah/TinyBERT_General_4L_312D"  # Легкая версия BERT
    model = AutoModel.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    # Подготовка входных данных
    dummy_input = tokenizer("This is a test sentence.", return_tensors="pt")

    # Экспорт модели в ONNX
    torch.onnx.export(
        model,
        args=(dummy_input["input_ids"], dummy_input["attention_mask"]),
        f=output_path,
        input_names=["input_ids", "attention_mask"],
        output_names=["last_hidden_state"],
        dynamic_axes={
            "input_ids": {0: "batch_size", 1: "sequence_length"},
            "attention_mask": {0: "batch_size", 1: "sequence_length"},
            "last_hidden_state": {0: "batch_size", 1: "sequence_length"},
        },
        opset_version=13,
    )
    print(f"Model exported to {output_path}")


# === Шаг 2: Создание структуры папок для Triton ===
def create_triton_model_repository(onnx_path="tinybert.onnx", model_repository="model_repository"):
    print("Creating Triton model repository...")
    model_name = "tinybert"
    model_dir = os.path.join(model_repository, model_name)
    version_dir = os.path.join(model_dir, "1")
    os.makedirs(version_dir, exist_ok=True)

    # Копирование ONNX-модели
    onnx_target_path = os.path.join(version_dir, "model.onnx")
    os.replace(onnx_path, onnx_target_path)

    # Создание config.pbtxt
    config_content = """
name: "tinybert"
platform: "onnxruntime_onnx"
max_batch_size: 0
input [
  {
    name: "input_ids"
    data_type: TYPE_INT64
    dims: [-1]
  },
  {
    name: "attention_mask"
    data_type: TYPE_INT64
    dims: [-1]
  }
]
output [
  {
    name: "last_hidden_state"
    data_type: TYPE_FP32
    dims: [-1, 312]  # Размерность выхода зависит от модели (312 для TinyBERT)
  }
]
instance_group [
  {
    kind: KIND_GPU
    count: 1
  }
]
"""
    config_path = os.path.join(model_dir, "config.pbtxt")
    with open(config_path, "w") as f:
        f.write(config_content.strip())

    print(f"Triton model repository created at {model_dir}")


# === Основная функция ===
if __name__ == "__main__":
    # Шаг 1: Экспорт модели в ONNX
    export_model_to_onnx()

    # Шаг 2: Создание структуры папок для Triton
    create_triton_model_repository(onnx_path="tinybert.onnx", model_repository="model_repository")