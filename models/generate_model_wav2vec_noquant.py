import os
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import onnx


class Wav2Vec2ModelExporter:
    def __init__(self, model_name, model_repository_dir="model_repository", model_name_dir="wav2vec2", version_dir="1"):
        """
        Инициализация экспортера модели.
        
        :param model_name: Название модели Hugging Face (например, "facebook/wav2vec2-base-960h").
        :param model_repository_dir: Корневая директория для моделей Triton.
        :param model_name_dir: Название модели в репозитории.
        :param version_dir: Версия модели.
        """
        self.model_name = model_name
        self.model_repository_dir = model_repository_dir
        self.model_name_dir = model_name_dir
        self.version_dir = version_dir

        # Создание структуры директорий
        self.model_dir = os.path.join(self.model_repository_dir, self.model_name_dir)
        os.makedirs(os.path.join(self.model_dir, self.version_dir), exist_ok=True)

        # Пути для файлов
        self.onnx_file_path = os.path.join(self.model_dir, self.version_dir, "model.onnx")
        self.config_file_path = os.path.join(self.model_dir, "config.pbtxt")

        # Загрузка модели и процессора
        self.model, self.processor = self.load_model_and_processor()

    def load_model_and_processor(self):
        """Загрузка модели и процессора."""
        print(f"Загрузка модели и процессора: {self.model_name}")
        model = Wav2Vec2ForCTC.from_pretrained(self.model_name)
        processor = Wav2Vec2Processor.from_pretrained(self.model_name)
        return model, processor

    def export_model_to_onnx(self, dummy_input_shape=(1, 16000)):
        """Экспорт модели в ONNX."""
        print("Экспорт модели в ONNX...")
        dummy_input = torch.randn(dummy_input_shape)

        torch.onnx.export(
            self.model,
            dummy_input,
            self.onnx_file_path,
            input_names=["input"],
            output_names=["output"],
            dynamic_axes={
                "input": {0: "batch_size", 1: "sequence_length"},
                "output": {0: "batch_size", 1: "sequence_length"}
            },
            opset_version=14
        )
        print(f"Модель успешно экспортирована в файл: {self.onnx_file_path}")

    def generate_triton_config(self):
        """Генерация файла конфигурации config.pbtxt для Triton."""
        print("Генерация файла конфигурации config.pbtxt...")
        config_content = f"""
name: "{self.model_name_dir}"
platform: "onnxruntime_onnx"
max_batch_size: 8
input [
  {{
    name: "input"
    data_type: TYPE_FP32
    dims: [-1]
  }}
]
output [
  {{
    name: "output"
    data_type: TYPE_FP32
    dims: [-1, {self.model.config.vocab_size}]
  }}
]
instance_group [
  {{
    kind: KIND_CPU
    count: 1
  }}
]
"""
        with open(self.config_file_path, "w") as config_file:
            config_file.write(config_content)
        print(f"Файл конфигурации создан: {self.config_file_path}")

    def run(self):
        """Основной метод для выполнения всех шагов."""
        print("Начало процесса экспорта модели...")
        self.export_model_to_onnx()
        self.generate_triton_config()
        print(f"\nСтруктура директории для Triton создана в: {self.model_repository_dir}")
        print(f"- Финальная модель: {self.onnx_file_path}")
        print(f"- Конфигурационный файл: {self.config_file_path}")


# Пример использования
if __name__ == "__main__":
    exporter = Wav2Vec2ModelExporter(model_name="facebook/wav2vec2-base-960h")
    exporter.run()