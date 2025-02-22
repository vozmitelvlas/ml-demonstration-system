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
import apiClient from "../../utils/axios.jsx"
import Select from "react-select";
import {customStyle, firstStyle, secondStyle} from "../../utils/selectStyles.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import error from "eslint-plugin-react/lib/util/error.js";

const options = [
    {value: 'O1', label: 'First'},
    {value: 'O2', label: 'Second'}
];

export default function CatalogModels({isAdminMode}) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [tmpModelId, setTmpModelId] = useState([])

    const [models, setModels] = useState([])
    useEffect(() => {
        apiClient.get('/models/versions').then((res) => {
            setModels(res.data)
        }).catch(error => {
            console.error(error)
        })
    }, [isDeletingModel])

    let closeDeleteModal = () => {
        setIsDeletingModel(false)
    }
    let onDeleteModelClick = (event) => {
        let tr = event.target.closest("tr")
        setTmpModelId(tr.dataset.id.split(" "))
        setIsDeletingModel(true)
    }
    const onConfirmDeletingModel = async () => {
        try {
            await apiClient.delete(`/admin/models/${tmpModelId[0]}/versions/${tmpModelId[1]}`);
        } catch (serverError) {
            console.error(serverError)
        }
        setIsDeletingModel(false)
    }

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    let closeAddModal = (event) => {
        let addModal = event.target.closest(".add-modal-overlay")
        addModal.classList.add("add-modal-overlay_hidden")
    }
    let openAddModal = () => {
        let addModal = document.querySelector(".add-modal-overlay")
        addModal.classList.remove("add-modal-overlay_hidden")
    }
    let handleNewModelClick = () => {
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

                {isAdminMode && (
                    <div className="options-buttons_up">
                        <Button onClick={openAddModal}>Добавить модель</Button>
                        <Button>Импорт</Button>
                        <Button>Экспорт</Button>
                    </div>
                )}

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

                                <td className="text-center">{model.modelId}</td>
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
                    <Button classNames="filter-button" onClick={toggleSidebar}>Фильтр</Button>
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

                <div className="add-modal-overlay add-modal-overlay_hidden">
                    <div className="add-user-modal">
                        <div className="add-modal__title">
                            <h3>Новая модель</h3>
                        </div>
                        <div className="add-modal__table">
                            <table className="change-container__table tableHover naked-input">
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
                            <Button onClick={closeAddModal}>Отмена</Button>
                            <Button onClick={handleNewModelClick}>Добавить</Button>
                        </div>
                    </div>
                </div>
                <DeleteModal open={isDeletingModel} onNo={closeDeleteModal}
                             onYes={onConfirmDeletingModel}></DeleteModal>
            </main>
        </>
    )
}