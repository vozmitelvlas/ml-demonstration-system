import React, {useEffect, useState} from "react";
import "../ChangeData.css"
import styles from "./ModelData.module.css"
import Button from "../Button/Button.jsx";
import DataHeader from "../Headers/DataHeader.jsx";
import {useNavigate, useParams} from "react-router-dom";
import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";
import alarmLogo from "../../../assets/alarm.svg"
import apiClient from "../../utils/axios.jsx";

const options = [
    {value: 'O1', label: 'First'},
    {value: 'O2', label: 'Second'}
];

export default function ChangeModelData() {
    let modelData = ["ID", "Название", "Версия", "Статус", "RunTime", "Тип задачи", "URL модели"]
    const [activeBut, setActiveBut] = useState("first");
    const [alarm, setAlarm] = useState(null)
    let navigate = useNavigate()
    let {modelId, versionId} = useParams()

    const [model, setModel] = useState({})
    useEffect(() => {
        try {
            apiClient.get(`/admin/models/${modelId}/versions/${versionId}`).then((res) => {
                setModel(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, []);

    const [selectedValues, setSelectedValues] = useState([]);
    const handleSelectChange = (newValue) => {
        console.log(newValue)
        setSelectedValues(newValue);
    };
    let onChangeName = () => {
        setAlarm('Названия других версий данной модели также изменятся')
    }
    const onBlurName = () => {
        setAlarm(null)
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
                        <div className={styles.alarmContainer}>
                            {alarm &&
                                <b className={styles.alarm}><a className="a-img"><img src={alarmLogo}/> </a> {alarm}
                                </b>}
                        </div>
                        <table className="change-container__table tableHover naked-input">
                            <tbody>
                            <tr>
                                <td>ID</td>
                                <td className="text-center">
                                    <input type="text" defaultValue={model?.modelId}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Название</td>
                                <td className="text-center">
                                    <input type="text" onBlur={onBlurName} onChange={onChangeName}
                                           defaultValue={model?.modelName}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Версия</td>
                                <td className="text-center">
                                    <input type="text" defaultValue={model?.versionName}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Статус</td>
                                <td className="text-center">
                                    <input type="text" defaultValue={"ok"}/>
                                </td>
                            </tr>
                            <tr>
                                <td>RunTime</td>
                                <td className="text-center">
                                    <input type="text" defaultValue={model?.modelInfo?.runtime}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Тип задачи</td>
                                <td className="text-center">
                                    <input type="text" defaultValue={model?.modelInfo?.problemType}/>
                                </td>
                            </tr>

                            <tr>
                                <td>URI модели</td>
                                <td className="text-center">
                                    <input type="text" defaultValue={model.uri}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Описание</td>
                                <td><textarea defaultValue={model.description}></textarea></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                {activeBut === "second" && (
                    <div className="second">
                        <div>
                            <h2>Видимость</h2>
                            <div>
                                <p className="text-class">Организации с доступом к модели</p>
                                <Select
                                    className="limits-select naked-input"
                                    isMulti
                                    options={options}
                                    onChange={handleSelectChange}
                                    closeMenuOnSelect={false}
                                    placeholder={"Выбрать"}
                                    isSearchable
                                    styles={customStyle}
                                />
                            </div>
                        </div>
                        <div>
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