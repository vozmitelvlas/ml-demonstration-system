import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../Button/Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Filter from "../Filter/Filter.jsx";
import Input from "../Input/Input.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";

export default function CatalogUsers() {
    let navigate = useNavigate()
    let [isDeletingModel, setIsDeletingModel] = useState(false)
    let [isOpen, setIsOpen] = useState(false);

    let closeDeleteModal = () => {
        setIsDeletingModel(false)
    }
    let onDeleteUserClick = (event) => {
        let tr = event.target.closest("tr")
        setIsDeletingModel(true)
    }
    let toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    let closeAddModal = (event) => {
        let editModal = event.target.closest(".add-modal-overlay")
        editModal.classList.add("add-modal-overlay_hidden")
    }
    let openAddModal = () => {
        let editModal = document.querySelector(".add-modal-overlay")
        editModal.classList.remove("add-modal-overlay_hidden")

    };

    return (
        <>
            {isOpen &&
                <Filter
                    setIsOpen={setIsOpen}
                    selects={{
                        "Организация": {
                            options: ["Пользователи", "Администраторы"],
                            names: ["users", "admins"]
                        },
                    }}
                    sorts={{
                        "Сортировать": {
                            options: ["Фамилии (ФИ)", "Логину"],
                            names: ["FI", "login"]
                        },
                    }}></Filter>
            }
            <main>
                <CatalogHeader title={"Каталог пользователей"} searchFields={["Почта", "Фамилия"]}></CatalogHeader>

                <div className="options-buttons_up">
                    <Button onClick={openAddModal}>Добавить пользователя</Button>
                </div>

                <div className="catalog-users">
                    <table className="table-fill">
                        <thead>
                        <tr>
                            <th className="text-center"></th>
                            <th className="text-center">
                                <strong>Фамилия</strong>
                            </th>
                            <th className="text-center">
                                <strong>Имя</strong>
                            </th>
                            <th className="text-center">
                                <strong>Логин</strong>
                            </th>
                            <th className="text-center">
                                <strong>Почта</strong>
                            </th>
                            <th className="text-center">
                                <strong>Организация</strong>
                            </th>
                            <th className="text-center">
                                <strong>Дата регистрации</strong>
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="text-center">
                                <input type="checkbox"/>
                            </td>
                            <td className="text-center">Ivanov</td>
                            <td className="text-center">Ivan</td>
                            <td className="text-center">ivanov_ivan</td>
                            <td className="text-center">ivanovIvan@mail.ru</td>
                            <td className="text-center">Пользователи</td>
                            <td className="text-center">13.01.25</td>
                            <td className="text-center">
                                <Link className="a-img" to={`/users/${1}/edit`}><img src={editLogo}></img></Link>
                            </td>
                            <td className="text-center">
                                <a  className="a-img" onClick={onDeleteUserClick}><img src={deleteLogo}></img></a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="options-buttons">
                    <Button classNames="filter-button" onClick={toggleSidebar}>Фильтр</Button>
                    <div className="options-buttons_right-down">
                        <Button onClick={() => {navigate("/models")}}>Модели</Button>
                        <Button onClick={() => {navigate("/users")}}>Пользователи</Button>
                        <Button onClick={() => {navigate("/organisations")}}>Организации</Button>
                    </div>
                </div>
            </main>

            <div className="add-modal-overlay add-modal-overlay_hidden">
                <div className="add-user-modal">
                    <div className="add-modal__title">
                        <h3>Новый пользователь</h3>
                    </div>
                    <table className="change-container__table tableHover naked-input">
                        <tbody>
                        <tr>
                            <td>Логин</td>
                            <td className="text-center"><Input></Input></td>
                        </tr>
                        <tr>
                            <td>Фамилия</td>
                            <td className="text-center"><Input></Input></td>
                        </tr>
                        <tr>
                            <td>Имя</td>
                            <td className="text-center"><Input></Input></td>
                        </tr>
                        <tr>
                            <td>Отчество</td>
                            <td className="text-center"><Input></Input></td>
                        </tr>
                        <tr>
                            <td>E-mail</td>
                            <td className="text-center"><Input></Input></td>
                        </tr>
                        <tr>
                            <td>Пароль</td>
                            <td className="text-center"><Input></Input></td>
                        </tr>

                        <tr>
                            <td>Описание</td>
                            <td className="text-center"><textarea></textarea></td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="add-user__buttons">
                        <Button onClick={closeAddModal}>Отмена</Button>
                        <Button>Сохранить</Button>
                    </div>
                </div>
            </div>
            <DeleteModal open={isDeletingModel} onNo={closeDeleteModal}></DeleteModal>
        </>

    )
}