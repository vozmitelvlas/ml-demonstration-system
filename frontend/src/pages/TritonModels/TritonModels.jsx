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
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

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
      setResult(response.data);
    } catch (err) {
      setError("Ошибка при выполнении инференса. Попробуйте снова.");
      console.error("Ошибка запроса:", err);
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
        {loading ? "Выполняется..." : "Выполнить инференс"}
      </button>

      {result && (
        <div className={styles.result}>
          <h3>📊 Результат:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TritonModels;