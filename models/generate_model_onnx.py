import onnx
import onnx.helper as helper
import numpy as np
import os
import onnxruntime as ort

# Создание структуры директорий
os.makedirs("model_repository/model_example/1", exist_ok=True)

# Создание входного и выходного тензора
input_tensor = helper.make_tensor_value_info("input", onnx.TensorProto.FLOAT, [None, 1])
output_tensor = helper.make_tensor_value_info("output", onnx.TensorProto.FLOAT, [None, 1])

# Создание константного множителя через узел Constant
mul_const_tensor = helper.make_tensor(
    name="mul_const",
    data_type=onnx.TensorProto.FLOAT,
    dims=[1],
    vals=np.array([2.0], dtype=np.float32)
)

mul_const_node = helper.make_node("Constant", inputs=[], outputs=["mul_const"], value=mul_const_tensor)

# Создание узла (умножение на 2)
mul_node = helper.make_node("Mul", inputs=["input", "mul_const"], outputs=["output"])

# Создание модели с указанием версии Opset
graph_def = helper.make_graph([mul_const_node, mul_node], "MultiplyByTwoModel", [input_tensor], [output_tensor])
model_def = helper.make_model(
    graph_def,
    producer_name="onnx-mul-model",
    opset_imports=[onnx.helper.make_opsetid(domain="", version=21)]  # Указание версии Opset
)

# Валидация модели
onnx.checker.check_model(model_def)

# Сохранение модели в нужную папку
onnx.save(model_def, "model_repository/model_example/1/model.onnx")
print("Модель сохранена: model_repository/model_example/1/model.onnx")

# Создание config.pbtxt
config_text = """name: "model_example"
backend: "onnxruntime"
max_batch_size: 1
input [
  {
    name: "input"
    data_type: TYPE_FP32
    dims: [ 1 ]
  }
]
output [
  {
    name: "output"
    data_type: TYPE_FP32
    dims: [ 1 ]
  }
]
"""

with open("model_repository/model_example/config.pbtxt", "w") as f:
    f.write(config_text)

print("Конфиг сохранён: model_repository/model_example/config.pbtxt")

# === Тест инференса с ONNXRuntime ===
# Создание сеанса выполнения
ort_session = ort.InferenceSession("model_repository/model_example/1/model.onnx")

# Тестовые данные
input_data = np.array([[3.0]], dtype=np.float32)

# Запуск модели
outputs = ort_session.run(None, {"input": input_data})

print("Результат инференса:", outputs)

