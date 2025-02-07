import DataHeader from "../Headers/DataHeader.jsx";
import Input from "../Input/Input.jsx";
import Button from "../Button/Button.jsx";
import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styles from "./ModelData.module.css"


export default function ModelData() {
    let {modelId} = useParams()
    let navigate = useNavigate()
    const [activeBut, setActiveBut] = useState("first");
    let modelData = ["ID", "Название", "Версия", "Статус", "RunTime", "Тип задачи", "URL модели", "Образ модели"]

    return (
        <div className="change-container">
            <div>
                <DataHeader activeBut={activeBut}
                            setActiveBut={setActiveBut}
                            firstButton="ИНФОРМАЦИЯ"
                            secondButton="ВИЗУАЛИЗАЦИЯ">
                    Модель Graph-based segmentation model
                </DataHeader>

                {activeBut === "first" && (
                    <div>
                        <table className="change-container__table naked-input">
                            <tbody>
                            {modelData.map((title, index) => (
                                <tr key={index}>
                                    <td>{title}</td>
                                    <td className="text-center"><Input classNames={"text-center"}
                                                                       disabled={true}>something</Input></td>
                                </tr>
                            ))}
                            <tr>
                                <td>Описание</td>
                                <td><textarea id={"description"} rows="8" cols="47" defaultValue={"ADASAlasdair"}
                                              disabled></textarea></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                {activeBut === "second" && (
                    <div>
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
                    </div>
                )}
            </div>

            <div>
                <Button onClick={() => {
                    navigate("/models")
                }}>Назад</Button>
            </div>
        </div>
    )
}