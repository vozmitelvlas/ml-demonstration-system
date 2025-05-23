import React, { useState } from "react";
import axios from "axios";
import styles from "./TritonModels.module.css";

const TritonModels = () => {
  const [model, setModel] = useState("tinycov_model");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Обработчик выбора файла
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    let isValid = false;
    const fileName = selectedFile.name.toLowerCase();

    if (model === "wav2vec2" && (fileName.endsWith(".wav") || selectedFile.type === "audio/wav")) {
      isValid = true;
    } else if ((model === "unet_signal_processing" || model === "tinycov_model") &&
        (fileName.endsWith(".csv") || selectedFile.type === "application/csv")) {
      isValid = true;
    }

    if (isValid) {
      setFile(selectedFile);
      setError("");
    } else {
      setError(`Неверный формат файла для модели "${model}". Поддерживаются: ${getFileFormat(model)}.`);
      setFile(null);
    }
  };

  // Вспомогательная функция для подсказки форматов
  const getFileFormat = (modelName) => {
    switch (modelName) {
      case "wav2vec2": return ".wav";
      case "unet_signal_processing":
      case "tinycov_model": return ".csv";
      default: return "неизвестный формат";
    }
  };

  // Отправка на инференс
  const handleSubmit = async () => {
    if (!file) {
      setError("Пожалуйста, загрузите файл.");
      console.warn("Файл не выбран");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    console.log("Отправляем файл:", file.name);
    console.log("Модель:", model);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", model);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/triton-models/infer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Успешный ответ от сервера:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error("Ошибка при выполнении инференса:", err.response?.data || err.message);
      setError("Ошибка при выполнении инференса. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>🧬 Инференс моделей через Triton</h2>

      <div className={styles.formGroup}>
        <label htmlFor="model-select">Выберите модель:</label>
        <select
          id="model-select"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="tinycov_model">TinyConv (классификация)</option>
          <option value="unet_signal_processing">U-Net (сегментация)</option>
          <option value="wav2vec2">Wav2Vec2 (ASR - .wav → текст)</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="file-upload">
          Загрузите файл ({getFileFormat(model)}):
        </label>
        <input
          id="file-upload"
          type="file"
          accept={model === "wav2vec2" ? ".wav" : ".csv"}
          onChange={handleFileChange}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <>
            <span className={styles.spinner}></span>
            Выполняется...
          </>
        ) : (
          "Выполнить инференс"
        )}
      </button>

      {/* Результаты инференса */}
      {result && (
        <div className={styles.result}>
          <h3>📊 Результат:</h3>

          {/* U-Net — график */}
          {model === "unet_signal_processing" && result.original_signal && result.predicted_signal ? (
            <div className={styles.graphsContainer}>
              <div className={styles.graphBox}>
                <h4>Оригинальный сигнал</h4>
                <img src={result.original_signal} alt="Оригинальный сигнал" />
              </div>
              <div className={styles.graphBox}>
                <h4>Предсказание U-Net</h4>
                <img src={result.predicted_signal} alt="Предсказание модели" />
              </div>
            </div>
          ) : model === "wav2vec2" ? (
            <p><strong>Транскрипция:</strong> {result}</p>
          ) : (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default TritonModels;