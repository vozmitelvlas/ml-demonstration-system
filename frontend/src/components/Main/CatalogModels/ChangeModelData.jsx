import React, {useEffect, useState} from "react";
import "../ChangeData.css"

import Button from "../Button/Button.jsx";
import DataHeader from "../Headers/DataHeader.jsx";
import {useNavigate, useParams} from "react-router-dom";
import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";

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
    let onChangeName = () => {
        alert('Названия других версий данной модели также изменятся')
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
                    <div className="test">
                        <table className="change-container__table tableHover naked-input">
                            <tbody>
                            {modelData.map((title, index) => (
                                <tr key={index}>
                                    <td>{title}</td>
                                    <td className="text-center"><input type="text" onClick={onChangeName} defaultValue={"smt"}/></td>
                                </tr>
                            ))}
                            <tr>
                                <td>Описание</td>
                                <td><textarea defaultValue={"ADASAlasdair"}></textarea></td>
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
                                className="limits-select"
                                isMulti
                                options={options}
                                onChange={handleSelectChange}
                                closeMenuOnSelect={false}
                                placeholder={"Выбрать"}
                                isSearchable
                                styles={customStyle}
                            />
                        </div>

                        <h2>Лимиты по умолчанию</h2>
                        <table className="change-container__table tableHover naked-input">
                            <tbody>
                            <tr>
                                <td>Лимит RPS</td>
                                <td><input type="text" defaultValue={""}/></td>
                            </tr>
                            <tr>
                                <td>Лимит запросов/нед</td>
                                <td><input type="text" defaultValue={""}/></td>
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