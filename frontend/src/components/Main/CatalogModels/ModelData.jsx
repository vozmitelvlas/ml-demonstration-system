import DataHeader from "../Headers/DataHeader.jsx";
import Button from "../Button/Button.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styles from "./ModelData.module.css"
import apiClient from "../../utils/apiClient.jsx";


export default function ModelData({isAdmin}) {
    const navigate = useNavigate()
    const {modelId, versionId} = useParams()
    const [activeBut, setActiveBut] = useState("first")
    const [modelData, setModelData] = useState({})

    useEffect(() => {
        apiClient(isAdmin ? `/api/admin/models/${modelId}/versions/${versionId}` : `/api/models/versions/${versionId}`).then(res => {
            setModelData(res)
        }).catch(error => {
            console.log(error)
        })

    }, [activeBut, isAdmin]);

    return (
        <div className="change-container">

            <DataHeader activeBut={activeBut}
                        setActiveBut={setActiveBut}
                        buttons={["ИНФОРМАЦИЯ", "ВИЗУАЛИЗАЦИЯ"]}
                        names={["first", "second"]}>
                {modelData.modelName}
            </DataHeader>

            {activeBut === "first" && (
                <div className="change-content">
                    <div>
                        <table className="change-container__table naked-input">
                            <tbody>
                            <tr>
                                <td>ID</td>
                                <td className="text-center">{modelData.modelId}</td>
                            </tr>
                            <tr>
                                <td>Название</td>
                                <td className="text-center">{modelData.modelName}</td>
                            </tr>
                            <tr>
                                <td>Версия</td>
                                <td className="text-center">{modelData.versionName}</td>
                            </tr>
                            <tr>
                                <td>Статус</td>
                                <td className="text-center">ok</td>
                            </tr>
                            <tr>
                                <td>RunTime</td>
                                <td className="text-center">{modelData.runtime}</td>
                            </tr>
                            <tr>
                                <td>Тип задачи</td>
                                <td className="text-center">{modelData.problemType}</td>
                            </tr>
                            <tr>
                                <td>URI модели</td>
                                <td className="text-center">{modelData.uri}</td>
                            </tr>
                            <tr>
                                <td>Описание</td>
                                <td>
                                    <textarea value={modelData.description} disabled></textarea>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.backButton}>
                        <Button onClick={() => {navigate("/models")}}>Назад</Button>
                    </div>
                </div>
            )}

            {activeBut === "second" && (
                <div className="change-content">
                    <div className="to-center">
                        <div className={styles.upload}>
                            <div className={styles.uploadContainer}>
                                <i className="fa fa-cloud-upload"></i>
                                <h3>Загрузите данные для модели</h3>
                                <p>Поддерживаемые форматы: PNG, JPEG, BMP</p>
                                <input type="file" id="file"/>
                            </div>
                        </div>

                        <button className={styles.sendButton}>Отправить</button>
                    </div>
                    <div className={styles.backButton}>
                        <Button onClick={() => {navigate("/models")}}>Назад</Button>
                    </div>
                </div>
            )}
        </div>
    )
}