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
import Input from "../Input/Input.jsx";
import Select from "react-select"

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
        console.log("asd")
    }

    const handleSelectChange = (newValue) => {
        console.log(newValue)
        setSelectedValues(newValue);
    };


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
                                <Link className="a-img" to={`/users/organisations/${1}/edit`}><img src={editLogo}></img></Link>
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
                        <Button>Мониторинг</Button>
                        <Button onClick={() => {
                            navigate("/users")
                        }}>Пользователи</Button>
                    </div>
                </div>

                <div className="add-modal-overlay add-modal-overlay_hidden">
                    <div className="add-modal">
                        <div className="add-modal__title">
                            <h3>Новая организация</h3>
                        </div>

                        <form className="add-modal__form">
                            <div className="add-modal__inputs">
                                <Input placeholder={"Название"}></Input>
                                <Input placeholder={"Руководитель (логин)"}></Input>
                                <Input placeholder={"Лимит запросов для участников"}></Input>
                            </div>

                            <div>
                                <p className={"text-class"}>Доступные модели:</p>
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

                            <div>
                                <p className={"text-class"}>Описание:</p>
                                <textarea id={"description"} rows="6" cols="35"
                                          defaultValue={"ADASAlasdair"}></textarea>
                            </div>


                            <div className="add-modal__buttons">
                                <Button type="submit" onClick={onCloseAddModal}>Отмена</Button>
                                <Button type="submit" onClick={onAddNewCatalog}>Добавить</Button>
                            </div>

                        </form>

                    </div>
                </div>

                <DeleteModal open={isDeletingModel} onNo={onCloseDeleteModal}></DeleteModal>
            </main>
        </>
    )
}