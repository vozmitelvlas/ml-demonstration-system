import DataHeader from "../Headers/DataHeader.jsx";
import Input from "../../Input.jsx";
import Button from "../../Button.jsx";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";


function ModelData(){
    let { modelId } = useParams()
    let navigate = useNavigate()
    let modelData = ["ID", "Название", "Статус", "RunTime", "Тип задачи", "URL модели", "Образ модели"]
    return(
        <div className="change-container">
            <div>
                <DataHeader firstButton="ИНФОРМАЦИЯ" secondButton="ВИЗУАЛИЗАЦИЯ">Модель Graph-based segmentation model</DataHeader>

                <div className="change-container__info">
                    <table className="change-container__table">

                        <tbody className="naked-input">
                        {modelData.map((title, index) => (
                            <tr key={index}>
                                <td>{title}</td>
                                <td className="text-center"><Input classNames={"text-center"} disabled={true}>something</Input></td>
                            </tr>
                        ))}
                        <tr>
                            <td>Описание</td>
                            <td><textarea id={"description"} rows="8" cols="47" defaultValue={"ADASAlasdair"} disabled></textarea></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="change-container__second" hidden>
                    <div className="to-center">
                        <div className="upload">
                            <div className="upload-container">
                                <i className="fa fa-cloud-upload"></i>
                                <h3>Загрузите данные для модели</h3>
                                <p>Поддерживаемые форматы: PNG, JPEG, BMP</p>
                                <input type="file" id="file"/>
                            </div>
                        </div>

                        <button className="sign-in-up__button">Отправить</button>
                    </div>

                </div>
            </div>


            <div className="delete-modal__buttons">
                <Button onClick={() => {navigate("/models")}}>Назад</Button>
            </div>
        </div>
    )
}

export default ModelData