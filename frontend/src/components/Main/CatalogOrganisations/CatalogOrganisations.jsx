import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../Button/Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import {Link, useNavigate} from "react-router-dom";
import "../Catalog.css"
import "../Table.css"
import React, {useState} from "react";
import Filter from "../Filter/Filter.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";

import Select from "react-select"
import {customStyle, firstStyle, secondStyle} from "../../utils/selectStyles.jsx";

const options = [
    {value: 'O1', label: 'First'},
    {value: 'O2', label: 'Second'}
];

export default function CatalogOrganisations() {
    let navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    let [isDeletingModel, setIsDeletingModel] = useState(false)
    const [selectedValues, setSelectedValues] = useState([]);

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
                                <strong>Название</strong>
                            </th>
                            <th className="text-center">
                                <strong>Руководитель</strong>
                            </th>
                            <th className="text-center">
                                <strong>Дата создания</strong>
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="text-center">Пользователи</td>
                            <td className="text-center">ivan_ivanov</td>
                            <td className="text-center">12.31.23</td>
                            <td className="text-center">
                                <Link className="a-img" to={`/organisations/${1}/edit`}><img
                                    src={editLogo}></img></Link>
                            </td>
                            <td className="text-center">
                                <a className="a-img" onClick={onDeleteOrgClick}><img src={deleteLogo}></img></a>
                            </td>
                        </tr>
                        <tr>
                        </tr>
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
                                    <td>Руководитель (логин)</td>
                                    <td className="text-center"><input type="text" defaultValue={""}/></td>
                                </tr>

                                <tr onMouseEnter={setFirstMultiBackColor} onMouseLeave={setSecondMultiBackColor}>
                                    <td>Доступные модели<span> *</span></td>
                                    <td>
                                        <Select
                                            className="multi-select"
                                            isMulti
                                            options={options}
                                            onChange={handleSelectChange}
                                            closeMenuOnSelect={false}
                                            placeholder={"Выбрать"}
                                            isSearchable
                                            styles={selectStyle}
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