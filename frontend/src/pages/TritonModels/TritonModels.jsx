import React, { useState } from "react";
import axios from "axios";
import styles from "./TritonModels.module.css";

const TritonModelBase = ({ modelType }) => {
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

    if (modelType === "wav2vec2" && (fileName.endsWith(".wav") || selectedFile.type === "audio/wav")) {
      isValid = true;
    } else if (
      (modelType === "unet_signal_processing" || modelType === "tinycov_model") &&
      (fileName.endsWith(".csv") || selectedFile.type === "application/csv")
    ) {
      isValid = true;
    }

    if (isValid) {
      setFile(selectedFile);
      setError("");
    } else {
      setError(`Неверный формат файла для модели "${modelType}". Поддерживаются: ${getFileFormat(modelType)}.`);
      setFile(null);
    }
  };

  const getFileFormat = (modelName) => {
    switch (modelName) {
      case "wav2vec2": return ".wav";
      case "unet_signal_processing":
      case "tinycov_model": return ".csv";
      default: return "неизвестный формат";
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Пожалуйста, загрузите файл.");
      console.warn("Файл не выбран");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", modelType);

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

  const countClasses = (classNames) => {
    return classNames.reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
  };

  const CLASS_COLORS = {
    "Нормальный": "#2196f3",
    "Фибрилляция": "#f44336",
    "Другая аритмия": "#ff9800",
    "Шум": "#9e9e9e",
    "Неопределённый": "#9c27b0"
  };

  const getClassColor = (className) => {
    return CLASS_COLORS[className] || "#000";
  };

  return (
    <div className={styles.container}>
      <h2>🧬 Инференс: {modelType}</h2>

      <div className={styles.formGroup}>
        <label htmlFor="file-upload">
          Загрузите файл ({getFileFormat(modelType)}):
        </label>
        <input
          id="file-upload"
          type="file"
          accept={modelType === "wav2vec2" ? ".wav" : ".csv"}
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

      {/* Результаты */}
      {result && (
        <div className={styles.result}>
          <h3>📊 Результат:</h3>

          {modelType === "unet_signal_processing" && result.original_signal && result.predicted_signal ? (
            <div className={styles.graphsContainer}>
              <div className={styles.graphBox}>
                <h4>🔹 Оригинальный сигнал</h4>
                <img src={result.original_signal} alt="Оригинал" />
              </div>
              <div className={styles.graphBox}>
                <h4>🔸 Предсказание U-Net</h4>
                <img src={result.predicted_signal} alt="Предсказание" />
              </div>
            </div>
          ) : modelType === "wav2vec2" ? (
            <p><strong>Транскрипция:</strong> {result}</p>
          ) : modelType === "tinycov_model" && result.predicted_class_names ? (
            <>
              <p><strong>Всего сигналов:</strong> {result.total_samples}</p>

              <div className={styles.distribution}>
                <h3>📊 Распределение классов</h3>
                <div className={styles.barChart}>
                  {Object.entries(countClasses(result.predicted_class_names)).map(([name, count], index) => (
                    <div
                      key={index}
                      className={styles.bar}
                      style={{
                        flex: count,
                        backgroundColor: getClassColor(name),
                      }}
                      title={`${name}: ${count} сигналов`}
                    >
                      {count}
                    </div>
                  ))}
                </div>

                <div className={styles.legend}>
                  {Array.from(new Set(result.predicted_class_names)).map((className, idx) => (
                    <div key={idx} className={styles.legendItem}>
                      <span
                        className={styles.legendColor}
                        style={{ backgroundColor: getClassColor(className) }}
                      ></span>
                      {className}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default TritonModelBase;