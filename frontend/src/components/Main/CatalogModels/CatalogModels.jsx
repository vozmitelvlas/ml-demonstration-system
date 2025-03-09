import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../Button/Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import copyLogo from "../../../assets/copy.svg"
import acceptLogo from "../../../assets/accept.svg"
import rejectLogo from "../../../assets/reject.svg"
import {Link, useNavigate} from "react-router-dom";
import "../ModalWindow.css"
import "../select.css"
import React, {useEffect, useState} from "react";
import Filter from "../Filter/Filter.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";
import apiClient from "../../utils/apiClient.jsx"
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import alarmLogo from "../../../assets/alarm.svg"
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import AddNewModelModal from "./AddNewModelModal.jsx";
import {useForm} from "react-hook-form";
import {AddNewModelVersionModal} from "./AddNewModelVersionModal.jsx";
import {yupResolver} from "@hookform/resolvers/yup";
import {signUpSchema} from "../../store/formSchema.jsx";
import * as yup from "yup";

export default function CatalogModels({isAdminMode}) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [tmpModelId, setTmpModelId] = useState([])
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)
    const [isAddingModel, setIsAddingModel] = useState(false)
    const [isAddingVersion, setIsAddingVersion] = useState(false)
    const [formatModels, setFormatModels] = useState([])
    const [isAddedModel, setIsAddedModel] = useState(false)

    const modelForm = useForm({
        resolver: yupResolver(yup.object()),
        defaultValues: {
            name: "",
            uri: "",
            description: "",
            problemType: "",
            runtime: "",
        }
    })
    const versionForm = useForm({
        resolver: yupResolver(yup.object()),
        defaultValues: {
            selectModel: null,
            versionName: "",
            uri: "",
            description: "",
        }
    })

    const [models, setModels] = useState([])
    useEffect(() => {
        const utl = isAdminMode ? '/api/admin/models/versions' : '/api/models/versions'
        apiClient(utl).then((res => {
            setModels(res)
        })).catch((error) => {
            console.log(error)
        })
    }, [isAdminMode])
    useEffect(() => {
        apiClient(`/api/admin/models`).then(res => {
            setFormatModels(res.map(model => ({
                value: model.modelId,
                label: model.name
            })))
        }).catch(error => {
            console.log(error)
        })
        setIsAddedModel(false)
    }, [isAddedModel])

    const firstErrorKey1 = Object.keys(modelForm.formState.errors)[0];
    useEffect(() => {
        if (firstErrorKey1) {
            setLogo(alarmLogo)
            setAlarm(modelForm.formState.errors[firstErrorKey1].message)
        }
    }, [firstErrorKey1])

    const firstErrorKey2 = Object.keys(versionForm.formState.errors)[0];
    useEffect(() => {
        if (firstErrorKey2) {
            setLogo(alarmLogo)
            setAlarm(versionForm.formState.errors[firstErrorKey2].message)
        }
    }, [firstErrorKey2])

    const closeDeleteModal = () => {
        setIsDeletingModel(false)
    }
    const onDeleteModelClick = (event) => {
        const tr = event.target.closest("tr")
        setTmpModelId(tr.dataset.id.split(" "))
        setIsDeletingModel(true)
        setAlarm(null)
    }
    const onConfirmDeletingModel = async () => {
        try {
            await apiClient(`/api/admin/models/${tmpModelId[0]}/versions/${tmpModelId[1]}`, 'DELETE')
            setModels(models.filter(model => model.modelVersionId !== Number(tmpModelId[1])))
            setLogo(acceptLogo)
            setAlarm("Модель успешно удалена")
        } catch (serverError) {
            console.error(serverError)
        }
        setIsDeletingModel(false)
    }

    const onAddNewModel = async (newValue) => {
        const formatValues = {...newValue}
        formatValues["problemType"] = newValue.problemType.label

        try {
            const res = await apiClient(`/api/admin/models`, 'POST', formatValues)

            setModels([...models, res])
            setIsAddingModel(!isAddingModel)
            setIsAddedModel(true)
            modelForm.reset()
            setAlarm("Модель успешно добавлена")
            setLogo(acceptLogo)
        } catch (error) {
            if (error.status === 409) {
                modelForm.setError('form', {type: 'server', message: error.detail})
            } else if (error.status === 400) {
                modelForm.setError('form', {type: 'server', message: error.errors})
            }
            else {
                console.log(error)
            }
        }
    }
    const onAddNewVersion = async (newValue) => {
        try {
            const {selectModel, ...formatValues} = newValue
            const modelId = selectModel.value
            const res = await apiClient(`/api/admin/models/${modelId}/versions`, 'POST', formatValues)

            setModels([...models, res])
            setIsAddingVersion(!isAddingVersion)
            versionForm.reset()
            setAlarm("Версия успешно добавлена")
            setLogo(acceptLogo)
        } catch (error) {
            if (error.status === 409)
                versionForm.setError('version', {type: 'server', message: error.detail})
            else
                console.log(error)
        }
    }
    const closeAddModal = () => {
        setIsAddingModel(!isAddingModel)
        setAlarm(null)
    }
    const closeVersion = () => {
        setIsAddingVersion(!isAddingVersion)
        setAlarm(null)
    }

    return (
        <>
            {isOpen &&
                <Filter
                    setIsOpen={setIsOpen}
                    selects={{
                        "Статус": {
                            options: ["Готово к использованию", "Недоступно"],
                            names: ["ready", "notReady"]
                        },
                        "Тип модели": {
                            options: ["TensorFlow"],
                            names: ["TensorFlow"]
                        },
                    }}
                    sorts={{
                        "Сортировать": {
                            options: ["Последние добавленные", "Давно добавленные"],
                            names: ["latestAdded", "oldestAdded"]
                        },
                    }}></Filter>
            }
            <main>
                <CatalogHeader title={"Каталог моделей"}
                               searchFields={["Название модели", "Тип модели"]}></CatalogHeader>

                <div className="options-buttons_up">
                    {isAdminMode && (
                        <div>
                            <Button onClick={() => {
                                setIsAddingModel(!isAddingModel)
                                setAlarm(null)
                            }}>Добавить модель</Button>
                            <Button onClick={() => {
                                setIsAddingVersion(!isAddingVersion)
                                setAlarm(null)
                            }}>Добавить версию</Button>
                        </div>
                    )}
                </div>

                <AlarmMsg logo={logo}>{alarm}</AlarmMsg>

                <div className="catalog-models">
                    <table className="table-fill">
                        <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">Статус</th>
                            <th className="text-center">Название</th>
                            <th className="text-center">Версия</th>
                            <th className="text-center">Тип модели</th>
                            <th className="text-center">Дата добавления</th>
                            <th className="text-center">URI модели</th>
                            {isAdminMode && (
                                <th></th>
                            )}
                            {isAdminMode && (
                                <th></th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {models.map(model => (
                            <tr key={`${model.modelId}${model.modelVersionId}`}
                                data-id={`${model.modelId} ${model.modelVersionId}`}>

                                <td className="text-center">{model.modelVersionId}</td>
                                <td className="text-center">
                                    <a><img src={acceptLogo} className="status-img" ></img></a>
                                </td>
                                <td className="text-center">
                                    <Link
                                        className="custom-link"
                                        to={`/models/${model.modelId}/versions/${model.modelVersionId}/data`}>
                                        {model.modelName}
                                    </Link>
                                </td>
                                <td className="text-center">{model.versionName}</td>
                                <td className="text-center">{model.problemType}</td>
                                <td className="text-center">{getDateFormat(new Date(model.createdAt))}</td>
                                <td className="text-center">
                                    <div className="URL">
                                        {model.uri}
                                        <a className="a-img" name="copyLogo"><img src={copyLogo}></img></a>
                                    </div>
                                </td>
                                {isAdminMode && (
                                    <td className="text-center">
                                        <Link className="a-img"
                                              to={`/models/${model.modelId}/versions/${model.modelVersionId}/edit`}>
                                            <img src={editLogo}></img>
                                        </Link>
                                    </td>
                                )}
                                {isAdminMode && (
                                    <td className="text-center">
                                        <a className="a-img" onClick={onDeleteModelClick}>
                                            <img src={deleteLogo}></img>
                                        </a>
                                    </td>
                                )}

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="options-buttons">
                    <Button classNames="filter-button" onClick={() => {
                        setIsOpen(!isOpen)
                    }}>Фильтр</Button>
                    {isAdminMode && (
                        <div className="options-buttons_right-down">
                            <Button onClick={() => {
                                navigate("/models")
                            }}>Модели</Button>
                            <Button onClick={() => {
                                navigate("/users")
                            }}>Пользователи</Button>
                            <Button onClick={() => {
                                navigate("/organisations")
                            }}>Организации</Button>
                        </div>
                    )}
                </div>

                <AddNewModelModal
                    logo={logo}
                    alarm={alarm}
                    isAddingModel={isAddingModel}
                    setIsAddingModel={setIsAddingModel}
                    onAdd={onAddNewModel}
                    onCancel={closeAddModal}
                    form={modelForm}
                ></AddNewModelModal>

                <AddNewModelVersionModal
                    logo={logo}
                    alarm={alarm}
                    isAddingVersion={isAddingVersion}
                    setIsAddingVersion={setIsAddingVersion}
                    onAdd={onAddNewVersion}
                    onCancel={closeVersion}
                    form={versionForm}
                    allModels={formatModels}
                ></AddNewModelVersionModal>

                <DeleteModal
                    open={isDeletingModel}
                    onNo={closeDeleteModal}
                    onYes={onConfirmDeletingModel}>
                </DeleteModal>
            </main>
        </>
    )
}