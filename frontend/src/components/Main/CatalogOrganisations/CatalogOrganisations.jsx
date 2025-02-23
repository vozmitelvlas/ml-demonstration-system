import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../Button/Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import {Link, useNavigate} from "react-router-dom";
import "../Catalog.css"
import "../Table.css"
import React, {useEffect, useState} from "react";
import Filter from "../Filter/Filter.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";
import {customStyle, firstStyle, secondStyle} from "../../utils/selectStyles.jsx";
import apiClient from "../../utils/axios.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";

export default function CatalogOrganisations() {
    let navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    let [isDeletingModel, setIsDeletingModel] = useState(false)
    const [selectedValues, setSelectedValues] = useState([]);

    const [organisation, setOrganisation] = useState([])
    useEffect(() => {
        apiClient.get("/api/admin/organizations").then(res => {
            setOrganisation(res.data)
        }).catch(error => {
            console.log(error)
        })
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    }
    let onCloseDeleteModal = () => {
        setIsDeletingModel(false)
    }
    let onDeleteOrgClick = (event) => {
        let tr = event.target.closest("tr")
        setIsDeletingModel(true)
    }
    let onCloseAddModal = (event) => {
        event.preventDefault()
        let addModal = event.target.closest(".add-modal-overlay")
        addModal.classList.add("add-modal-overlay_hidden")
    }
    let onOpenAddModal = () => {
        let addModal = document.querySelector(".add-modal-overlay")
        addModal.classList.remove("add-modal-overlay_hidden")
    }
    let onAddNewCatalog = (event) => {
        event.preventDefault()
    }
    const handleSelectChange = (newValue) => {
        console.log(newValue)
        setSelectedValues(newValue);
    };
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
                    sorts={{
                        "Сортировать": {
                            options: ["Последние добавленные", "Давно добавленные"],
                            names: ["latestAdded", "oldestAdded"]
                        },
                    }}></Filter>
            }
            <main>
                <CatalogHeader title={"Организации"} searchFields={["Название организации"]}></CatalogHeader>

                <div className="options-buttons_up">
                    <Button onClick={onOpenAddModal}>Добавить организацию</Button>
                </div>

                <div className="catalog-orgs">
                    <table className="table-fill table-organisation">
                        <thead>
                        <tr>
                            <th className="text-center">
                                <strong>ID</strong>
                            </th>
                            <th className="text-center">
                                <strong>Название</strong>
                            </th>
                            <th className="text-center">
                                <strong>Дата создания</strong>
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {organisation.map(org => (
                            <tr key={org.organizationId}>
                                <td className="text-center">{org.organizationId}</td>
                                <td className="text-center">{org.name}</td>
                                <td className="text-center">{getDateFormat(new Date(org.createdAt))}</td>
                                <td className="text-center">
                                    <Link className="a-img" to={`/organisations/${org.organizationId}/edit`}><img
                                        src={editLogo}></img></Link>
                                </td>
                                <td className="text-center">
                                    <a className="a-img" onClick={onDeleteOrgClick}><img src={deleteLogo}></img></a>
                                </td>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </div>

                <div className="options-buttons">
                    <Button classNames="filter-button" onClick={toggleSidebar}>Фильтр</Button>
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
                </div>

                <div className="add-modal-overlay add-modal-overlay_hidden">
                    <div className="add-user-modal">
                        <div className="add-modal__title">
                            <h3>Новая организация</h3>
                        </div>
                        <div className="add-modal__table">
                            <table className="change-container__table tableHover naked-input">
                                <tbody>
                                <tr>
                                    <td>Название<span> *</span></td>
                                    <td className="text-center"><input type="text" defaultValue={""}/></td>
                                </tr>
                                <tr>
                                    <td>Описание</td>
                                    <td><textarea></textarea></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="delete-modal__buttons">
                            <Button type="submit" onClick={onCloseAddModal}>Отмена</Button>
                            <Button type="submit" onClick={onAddNewCatalog}>Добавить</Button>
                        </div>
                    </div>
                </div>

                <DeleteModal open={isDeletingModel} onNo={onCloseDeleteModal}></DeleteModal>
            </main>
        </>
    )
}