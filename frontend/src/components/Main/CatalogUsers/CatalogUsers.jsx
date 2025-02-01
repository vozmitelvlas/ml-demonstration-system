import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../../Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import "../Catalog.css"
import "../CatalogModels/Table.css"
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Filter from "../Filter/Filter.jsx";
import Input from "../../Input.jsx";

function CatalogUsers() {
    let navigate = useNavigate()

    let modelsCatalog = (event) => {
        navigate("/models")
    }
    let usersGroups = () => {
        navigate("/users/organisations")
    }
    let clickOnTbody = (event) => {
        let deleteRef = event.target.closest('[name="deleteLogo"]')
        let editRef = event.target.closest('[name="editLogo"]')
        if (editRef) {
            navigate("/users/edit")
        } else if (deleteRef) {

        }
    }
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    let closeModal = (event) => {
        let editModal = event.target.closest(".edit-modal-overlay")
        editModal.classList.add("edit-modal-overlay_hidden")
    }
    const addUser = () => {
        let editModal = document.querySelector(".edit-modal-overlay")
        editModal.classList.remove("edit-modal-overlay_hidden")

    };


    return (
        <>
            {isOpen &&
                <Filter
                    setIsOpen={setIsOpen}
                    selects={{
                        "Группа": {
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
                    <Button onClick={addUser}>Добавить пользователя</Button>
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
                                <strong>Группа</strong>
                            </th>
                            <th className="text-center">
                                <strong>Дата регистрации</strong>
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody onClick={clickOnTbody}>
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
                                <a><img name="editLogo" className="a-img" src={editLogo}></img></a>
                            </td>
                            <td className="text-center">
                                <a name="deleteLogo" className="a-img"><img src={deleteLogo}></img></a>
                            </td>
                        </tr>
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
                                <a><img name="editLogo" className="a-img" src={editLogo}></img></a>
                            </td>
                            <td className="text-center">
                                <a name="deleteLogo" className="a-img"><img src={deleteLogo}></img></a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="options-buttons">
                    <Button classNames={"filter-button"} onClick={toggleSidebar}>Фильтр</Button>
                    <div className="options-buttons_right-down">
                        <Button>Мониторинг</Button>
                        <Button onClick={usersGroups}>Организации</Button>
                        <Button onClick={modelsCatalog}>Модели</Button>
                    </div>
                </div>
            </main>

            <div className="edit-modal-overlay edit-modal-overlay_hidden">
                <div className="edit-modal">
                    <div className="edit-modal__title">
                        <h3>Добавление пользователя</h3>
                    </div>
                    <table className="change-container__table tableHover ">
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
                            <td className="text-center"><textarea id={"description"} rows="12" cols="50" defaultValue={""}></textarea></td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="edit-modal__buttons">
                        <Button onClick={closeModal}>Отмена</Button>
                        <Button>Сохранить</Button>
                    </div>
                </div>
            </div>
        </>

    )
}

export default CatalogUsers