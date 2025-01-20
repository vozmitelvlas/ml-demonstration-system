import React, {useState} from "react";
import "./ModelData.css"
import Input from "../../Input.jsx";
import Button from "../../Button.jsx";
import DataHeader from "../Headers/DataHeader.jsx";
import {useNavigate, useParams} from "react-router-dom";

function ChangeModelData(qualifiedName) {
    let navigate = useNavigate()
    let { modelId } = useParams()

    let modelData = ["ID", "Название", "Статус", "RunTime", "Тип задачи", "URL модели", "Образ модели"]

    return (
        <div className="change-container">
            <div>
                <DataHeader firstButton="ИНФОРМАЦИЯ" secondButton="ОГРАНИЧЕНИЯ">Изменение данных модели</DataHeader>

                <div className="change-container__info">
                    <table className="change-container__table">

                        <tbody className="naked-input">
                        {modelData.map((title, index) => (
                            <tr key={index}>
                                <td>{title}</td>
                                <td><Input classNames={"text-center"}>something</Input></td>
                            </tr>
                        ))}
                        <tr>
                            <td>Описание</td>
                            <td><textarea id={"description"} rows="8" cols="47" defaultValue={"ADASAlasdair"}></textarea></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="change-container__second" hidden>
                    <h2>Видимость</h2>
                    <div className="select-container">
                        <p className="text-class">Группы с доступом к модели</p>
                        <div className="row">
                            <select className="js-select2" multiple="multiple">
                                <option value="O1" data-badge="">Администраторы</option>
                                <option value="O2" data-badge="">Пользователи</option>
                            </select>
                        </div>
                    </div>

                    <h2>Лимиты по умолчанию</h2>
                    <table className="change-container__table">
                        <tbody className="naked-input">
                        <tr>
                            <td>Лимит RPS</td>
                            <td><Input classNames={"text-center"}>50</Input></td>
                        </tr>
                        <tr>
                            <td>Лимит запрсов/нед</td>
                            <td><Input>1000</Input></td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>


            <div className="delete-modal__buttons">
                <Button onClick={() => {navigate("/models")}}>Назад</Button>
                <Button>Сохранить</Button>
            </div>
        </div>

    )

}

export default ChangeModelData