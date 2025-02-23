import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../Button/Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Filter from "../Filter/Filter.jsx";

import DeleteModal from "../../utils/DeleteModal.jsx";
import apiClient from "../../utils/axios.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import alarmLogo from "../../../assets/alarm.svg";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import acceptLogo from "../../../assets/accept.svg"

export default function CatalogUsers() {
    const navigate = useNavigate()
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [tmpUserId, setTmpUserId] = useState("")
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)

    const [users, setUsers] = useState([])
    useEffect(() => {
        apiClient.get('/api/admin/users').then((res) => {
            setUsers(res.data)
        }).catch(error => {
            console.error(error)
        })
    }, [isDeletingModel])

    const closeDeleteModal = () => {
        setIsDeletingModel(false)
    }
    const onDeleteUserClick = (event) => {
        let tr = event.target.closest("tr")

        setTmpUserId(tr.dataset.id)
        setIsDeletingModel(true)
    }
    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    };

    const closeAddModal = (event) => {
        let editModal = event.target.closest(".add-modal-overlay")
        editModal.classList.add("add-modal-overlay_hidden")
    }
    const openAddModal = () => {
        let editModal = document.querySelector(".add-modal-overlay")
        editModal.classList.remove("add-modal-overlay_hidden")

    };

    const onConfirmDeletingUser = async () => {
        try {
            await apiClient.delete(`/api/admin/users/${tmpUserId}`);
            setAlarm("Пользователь успешно удален")
            setLogo(acceptLogo)
        } catch (error) {
            console.error(error)
        }
        setIsDeletingModel(false)
    }

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
                <AlarmMsg logo={logo} alarm={alarm}></AlarmMsg>

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
                        {users.map(user => (
                            <tr key={user.userId}
                                data-id={user.userId}>
                                <td className="text-center">
                                    <input type="checkbox"/>
                                </td>
                                <td className="text-center">{user.lastName}</td>
                                <td className="text-center">{user.firstName}</td>
                                <td className="text-center">{user.login}</td>
                                <td className="text-center">{user.email}</td>
                                <td className="text-center">{user.organization.name}</td>
                                <td className="text-center">{getDateFormat(new Date(user.createdAt))}</td>
                                <td className="text-center">
                                    <Link className="a-img" to={`/users/${user.userId}/edit`}><img
                                        src={editLogo}></img></Link>
                                </td>
                                <td className="text-center">
                                    <a className="a-img" onClick={onDeleteUserClick}><img src={deleteLogo}></img></a>
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
            </main>

            <div className="add-modal-overlay add-modal-overlay_hidden">
                <div className="add-user-modal">
                    <div className="add-modal__title">
                        <h3>Новый пользователь</h3>
                    </div>
                    <table className="change-container__table tableHover naked-input">
                        <tbody>
                        <tr>
                            <td>Логин<span> *</span></td>
                            <td className="text-center"><input type="text" defaultValue={""} required/></td>
                        </tr>
                        <tr>
                            <td>Фамилия<span> *</span></td>
                            <td className="text-center"><input type="text" defaultValue={""} required/></td>
                        </tr>
                        <tr>
                            <td>Имя<span> *</span></td>
                            <td className="text-center"><input type="text" defaultValue={""} required/></td>
                        </tr>
                        <tr>
                            <td>Отчество</td>
                            <td className="text-center"><input type="text" defaultValue={""}/></td>
                        </tr>
                        <tr>
                            <td>E-mail<span> *</span></td>
                            <td className="text-center"><input type="text" defaultValue={""} required/></td>
                        </tr>
                        <tr>
                            <td>Пароль<span> *</span></td>
                            <td className="text-center"><input type="text" defaultValue={""} required/></td>
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
            <DeleteModal open={isDeletingModel} onNo={closeDeleteModal} onYes={onConfirmDeletingUser}></DeleteModal>
        </>

    )
}