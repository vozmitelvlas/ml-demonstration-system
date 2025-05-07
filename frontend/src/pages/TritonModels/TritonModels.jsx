import React, { useState } from "react";
import axios from "axios";
import styles from "./TritonModels.module.css";

const TritonModels = () => {
    const [model, setModel] = useState("tinycov_model");
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError("");
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Пожалуйста, выберите файл для загрузки.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("model", model);

        try {
            const response = await axios.post("http://localhost:2001/infer", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setResult(response.data);
        } catch (err) {
            setError("Ошибка при выполнении инференса. Попробуйте снова.");
            console.error(err);
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
                    <option value="tinycov_model">TinyConv</option>
                    <option value="unet_signal_processing">U-Net</option>
                    <option value="wav2vec2">Wav2Vec2</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="file-upload">Загрузите файл (.npy или .wav):</label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".npy,.wav"
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