import React, {useEffect, useState} from "react";
import "../ChangeData.css"
import Input from "../Input/Input.jsx";
import Button from "../Button/Button.jsx";
import DataHeader from "../Headers/DataHeader.jsx";
import {useNavigate, useParams} from "react-router-dom";
import Select from "react-select";

const options = [
    {value: 'O1', label: 'First'},
    {value: 'O2', label: 'Second'}
];

export default function ChangeModelData() {
    let modelData = ["ID", "Название", "Версия", "Статус", "RunTime", "Тип задачи", "URL модели", "Образ модели"]
    const [activeBut, setActiveBut] = useState("first");
    let navigate = useNavigate()
    let {modelId} = useParams()

    const [selectedValues, setSelectedValues] = useState([]);
    const handleSelectChange = (newValue) => {
        console.log(newValue)
        setSelectedValues(newValue);
    };

    let createTooltip = (text) => {
        let span = document.createElement("span")
        span.className = "tooltip"
        span.textContent = text
        return span
    }
    let showToolTip = (event) => {
        let info = event.target.closest("div")
        info.prepend(createTooltip("Названия других версий данной модели также изменятся"))
    }
    let closeTooltip = () => {
        let tooltip = document.querySelector(".tooltip")
        if (tooltip) {
            tooltip.remove()
        }
    }

    return (
        <div className="change-container">
            <div>
                <DataHeader
                    activeBut={activeBut}
                    setActiveBut={setActiveBut}
                    firstButton="ИНФОРМАЦИЯ"
                    secondButton="ОГРАНИЧЕНИЯ">
                    Изменение данных модели
                </DataHeader>

                {activeBut === "first" && (
                    <div>
                        <table className="change-container__table tableHover naked-input">
                            <tbody>
                            {modelData.map((title, index) => (
                                <tr key={index}>
                                    <td>{title}</td>
                                    <td className="text-center"><Input onMouseOver={showToolTip}
                                                                       onMouseOut={closeTooltip}>something</Input></td>
                                </tr>
                            ))}
                            <tr>
                                <td>Описание</td>
                                <td><textarea id={"description"} rows="6" cols="47"
                                              defaultValue={"ADASAlasdair"}></textarea></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                {activeBut === "second" && (
                    <div>
                        <h2>Видимость</h2>
                        <div className="select-container">
                            <p className="text-class">Организации с доступом к модели</p>
                            <Select
                                className="multi-select"
                                isMulti
                                options={options}
                                onChange={handleSelectChange}
                                closeMenuOnSelect={false}
                                placeholder={"Выбрать"}
                                isSearchable
                            />
                        </div>

                        <h2>Лимиты по умолчанию</h2>
                        <table className="change-container__table tableHover naked-input">
                            <tbody>
                            <tr>
                                <td>Лимит RPS</td>
                                <td><Input>50</Input></td>
                            </tr>
                            <tr>
                                <td>Лимит запрсов/нед</td>
                                <td><Input>1000</Input></td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="delete-modal__buttons">
                <Button onClick={() => {
                    navigate("/models")
                }}>Назад</Button>
                <Button>Сохранить</Button>
            </div>
        </div>

    )

}