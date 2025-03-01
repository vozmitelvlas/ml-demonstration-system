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
import Select from "react-select";
import {customStyle, firstStyle, secondStyle} from "../../utils/selectStyles.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import alarmLogo from "../../../assets/alarm.svg"
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";

const options = [
    {value: 'O1', label: 'First'},
    {value: 'O2', label: 'Second'}
];

export default function CatalogModels({isAdminMode, isAdmin}) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [tmpModelId, setTmpModelId] = useState([])
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)
    const [isAddingModel, setIsAddingModel] = useState(false)

    const [models, setModels] = useState([])
    useEffect(() => {
        apiClient(isAdmin ? '/api/admin/models/versions' : '/api/models/versions').then((res => {
            setModels(res)
        })).catch((error) => {
            console.log(error);
        });
    }, [isDeletingModel, isAdmin])

    const closeDeleteModal = () => {
        setIsDeletingModel(false)
    }
    const onDeleteModelClick = (event) => {
        let tr = event.target.closest("tr")
        setTmpModelId(tr.dataset.id.split(" "))
        setIsDeletingModel(true)
    }
    const onConfirmDeletingModel = async () => {
        try {
            await apiClient(`/api/admin/models/${tmpModelId[0]}/versions/${tmpModelId[1]}`, 'DELETE');
            setLogo(acceptLogo)
            setAlarm("Модель успешно удалена")
        } catch (serverError) {
            console.error(serverError)
        }
        setIsDeletingModel(false)
    }

    const handleNewModelClick = () => {
        navigate("models/edit")
    }

    const [selectStyle, setSelectStyles] = useState(customStyle);
    const setFirstMultiBackColor = () => {
        setSelectStyles((prev) => firstStyle(prev));
    };
    const setSecondMultiBackColor = () => {
        setSelectStyles((prev) => secondStyle(prev));
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
                            <Button>Добавить версию</Button>
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
                            <th className="text-center">URL модели</th>
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
                                    <a><img src={acceptLogo}></img></a>
                                </td>
                                <td className="text-center"><Link
                                    to={`/models/${model.modelId}/versions/${model.modelVersionId}/data`}>{model.modelName}</Link>
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
                                              to={`/models/${model.modelId}/versions/${model.modelVersionId}/edit`}><img
                                            src={editLogo}></img></Link>
                                    </td>
                                )}
                                {isAdminMode && (
                                    <td className="text-center">
                                        <a className="a-img" onClick={onDeleteModelClick}><img
                                            src={deleteLogo}></img></a>
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

                <div className={`add-modal-overlay ${isAddingModel ? "" : "add-modal-overlay_hidden"}`}>
                    <form className="add-container">
                        <div className="add-modal__title">
                            <h3>Новая модель</h3>
                        </div>
                        <AlarmMsg logo={logo}>{alarm}</AlarmMsg>
                        <div className="add-modal__table">
                            <table className="change-container__table naked-input">
                                <tbody>
                                <tr>
                                    <td>Название<span> *</span></td>
                                    <td className="text-center"><input type="text" defaultValue={""} required/></td>
                                </tr>
                                <tr onMouseEnter={setFirstMultiBackColor} onMouseLeave={setSecondMultiBackColor}>
                                    <td>Тип задачи<span> *</span></td>
                                    <td>
                                        <Select
                                            isMulti
                                            options={options}
                                            closeMenuOnSelect={false}
                                            placeholder={"Тип"}
                                            isSearchable
                                            styles={selectStyle}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Описание</td>
                                    <td><textarea></textarea></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="delete-modal__buttons">
                            <Button onClick={() => {
                                setIsAddingModel(!isAddingModel)
                            }}>Отмена</Button>
                            <Button onClick={handleNewModelClick}>Добавить</Button>
                        </div>
                    </form>
                </div>
                <DeleteModal
                    open={isDeletingModel}
                    onNo={closeDeleteModal}
                    onYes={onConfirmDeletingModel}>
                </DeleteModal>
            </main>
        </>
    )
}