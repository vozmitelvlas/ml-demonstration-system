import React, {useEffect, useState} from "react";
import "../ChangeData.css"
import styles from "./ModelData.module.css"
import Button from "../Button/Button.jsx";
import DataHeader from "../Headers/DataHeader.jsx";
import {useNavigate, useParams} from "react-router-dom";
import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";
import acceptLogo from "../../../assets/accept.svg"
import alarmLogo from "../../../assets/alarm.svg"
import apiClient from "../../utils/axios.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeModelDataSchema, signInSchema} from "../../store/formSchema.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx"
import deleteLogo from "../../../assets/delete.svg";

const options = [
    {value: 'O1', label: 'First'},
    {value: 'O2', label: 'Second'}
];
const modelDataForDisplay = {
    modelId: "",
    status: "ok",
    createdAt: "",
}
const limitDataForSend = {
    rps: 0,
    requestsPerWeek: 0,
}

export default function ChangeModelData() {
    const [activeBut, setActiveBut] = useState("first");
    const [alarm, setAlarm] = useState(null)
    const navigate = useNavigate()
    const {modelId, versionId} = useParams()
    const [logo, setLogo] = useState(alarmLogo)
    const [modelData, setModelData] = useState({});
    const [displayData, setDisplayData] = useState(modelDataForDisplay)
    const [limit, setLimit] = useState({})
    const [selectedValues, setSelectedValues] = useState([]);

    const handleSelectChange = (newValue) => {
        console.log(newValue)
        setSelectedValues(newValue);
    };
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        resolver: yupResolver(changeModelDataSchema)
    })

    useEffect(() => {
        apiClient.get(`/admin/models/${modelId}/versions/${versionId}`).then((res) => {
            const dataForEdit = {
                modelName: res.data.modelName,
                versionName: res.data.versionName,
                description: res.data.description,
                uri: res.data.uri,
                runtime: res.data.runtime,
                problemType: res.data.problemType,
            }
            const dataForDisplay = {
                modelId: res.data.modelId,
                status: "ok",
                createdAt: res.data.createdAt,
            }
            const limitData = {
                rps: res.data.limit.rps,
                requestsPerWeek: res.data.limit.requestsPerWeek
            }

            setModelData(res.data)
            setDisplayData(dataForDisplay)
            setLimit(limitData)
            reset(dataForEdit)
            setAlarm(null)
        }).catch(error => {
            console.log(error)
        })
    }, [activeBut]);

    useEffect(() => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            setLogo(alarmLogo)
            setAlarm(errors[firstErrorKey].message)
        }
    }, [errors]);


    const onChangeName = () => {
        setLogo(alarmLogo)
        setAlarm('Названия других версий данной модели также изменятся')
    }
    const onBlurName = () => {
        setAlarm(null)
    }
    const onSaveModelData = async (modelData) => {
        try {
            await apiClient.put(`/admin/models/${modelId}/versions/${versionId}`, modelData);
            setLogo(acceptLogo)
            setAlarm('Изменения сохранены')
        } catch (error) {
            console.error(error);
        }

        // try {
        //     await apiClient.put(`/admin/models/${modelId}/versions/${versionId}/limit`, limit);
        // } catch (error) {
        //     console.error(error);
        // }
    }

    return (
        <div className="change-container">
            <DataHeader
                activeBut={activeBut}
                setActiveBut={setActiveBut}
                firstButton="ИНФОРМАЦИЯ"
                secondButton="ОГРАНИЧЕНИЯ">
                Изменение данных модели
            </DataHeader>

            <AlarmMsg logo={logo} alarm={alarm}></AlarmMsg>

            {activeBut === "first" && (
                <form onSubmit={handleSubmit(onSaveModelData)} className="change-content">
                    <div>
                        <table className="change-container__table naked-input data-input">
                            <tbody>
                            <tr>
                                <td>ID</td>
                                <td className="text-center">
                                    <input type="text" value={displayData.modelId} disabled/>
                                </td>
                            </tr>
                            <tr>
                                <td>Статус</td>
                                <td className="text-center">
                                    <input type="text" value={displayData.status} disabled/>
                                </td>
                            </tr>
                            <tr>
                                <td>Название</td>
                                <td className="text-center">
                                    <input
                                        type="text"
                                        {...register("modelName")}
                                        onChange={e => {
                                            onChangeName();
                                            register("modelName").onChange(e).then(r => {
                                            });
                                        }}
                                        onBlur={e => {
                                            onBlurName();
                                            register("modelName").onBlur(e).then(r => {
                                            });
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Версия</td>
                                <td className="text-center">
                                    <input type="text" {...register("versionName")}/>
                                </td>
                            </tr>
                            <tr>
                                <td>RunTime</td>
                                <td className="text-center">
                                    <input type="text" {...register("runtime")}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Тип задачи</td>
                                <td className="text-center">
                                    <input type="text" {...register("problemType")}/>
                                </td>
                            </tr>

                            <tr>
                                <td>URI модели</td>
                                <td className="text-center">
                                    <input type="text" {...register("uri")}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Описание</td>
                                <td>
                                    <textarea name="description"{...register("description")}></textarea>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="delete-modal__buttons">
                        <Button type="button" onClick={() => {
                            navigate("/models")
                        }}>Назад</Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </form>

            )}

            {activeBut === "second" && (
                <form className="change-content">
                    <div className="select-container">
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
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={limit.rps}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Лимит запросов/нед</td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={limit.requestsPerWeek}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="delete-modal__buttons">
                        <Button type="button" onClick={() => {
                            navigate("/models")
                        }}>Назад</Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </form>
            )}
        </div>
    )
}