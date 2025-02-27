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
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {signUpSchema} from "../../store/formSchema.jsx";

export default function CatalogUsers() {
    const navigate = useNavigate()
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [tmpUserId, setTmpUserId] = useState("")
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)
    const [isAddingUser, setIsAddingUser] = useState(false)
    const [users, setUsers] = useState([])
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm({
        resolver: yupResolver(signUpSchema)
    })

    useEffect(() => {
        apiClient.get('/api/admin/users').then((res) => {
            setUsers(res.data)
        }).catch(error => {
            console.error(error)
        })
    }, [isDeletingModel])

    useEffect(() => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            setLogo(alarmLogo)
            setAlarm(errors[firstErrorKey].message)
        }
    }, [errors]);

    const onDeleteUserClick = (event) => {
        const tr = event.target.closest("tr")

        setTmpUserId(tr.dataset.id)
        setIsDeletingModel(true)
    }
    const toggleSidebar = () => {
        setIsOpen(!isOpen)
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
    const onSaveUserData = async (newValue) => {
        newValue["roles"] = ["USER"]
        newValue["organizationId"] = 4
        try {
            const res = await apiClient.post(`/api/admin/users`, newValue)
            const tmpUsers = [...users]
            tmpUsers.push(res.data)

            setUsers(tmpUsers)
            setAlarm("Пользователь успешно создан")
            setLogo(acceptLogo)
            reset({})
            setIsAddingUser(!isAddingUser)
        } catch (error) {
            if (error.response?.status === 409) {
                setLogo(alarmLogo)
                setAlarm("Пользователь уже существует")
            } else {
                console.log(error)
            }
        }
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
                    <Button onClick={() => {
                        setIsAddingUser(!isAddingUser)
                        setAlarm(null)
                    }}>Добавить пользователя</Button>
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

            <div className={`add-modal-overlay ${isAddingUser ? "" : "add-modal-overlay_hidden"}`}>
                <form onSubmit={handleSubmit(onSaveUserData)} className="add-container">
                    <div className="add-modal__title">
                        <h3>Новый пользователь</h3>
                    </div>
                    <AlarmMsg logo={logo} alarm={alarm}></AlarmMsg>
                    <table className="change-container__table naked-input">
                        <tbody>
                        <tr>
                            <td>Логин<span> *</span></td>
                            <td className="text-center">
                                <input type="text" {...register("login")} required/>
                            </td>
                        </tr>
                        <tr>
                            <td>Фамилия<span> *</span></td>
                            <td className="text-center">
                                <input type="text" {...register("lastName")} required/>
                            </td>
                        </tr>
                        <tr>
                            <td>Имя<span> *</span></td>
                            <td className="text-center">
                                <input type="text" {...register("firstName")} required/>
                            </td>
                        </tr>
                        <tr>
                            <td>Отчество</td>
                            <td className="text-center">
                                <input type="text" {...register("patronymic")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>E-mail<span> *</span></td>
                            <td className="text-center">
                                <input type="text" {...register("email")} required/>
                            </td>
                        </tr>
                        <tr>
                            <td>Пароль<span> *</span></td>
                            <td className="text-center">
                                <input type="password" {...register("password")} required/>
                            </td>
                        </tr>

                        <tr>
                            <td>Описание</td>
                            <td className="text-center">
                                <textarea {...register("description")}></textarea>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="add-user__buttons">
                        <Button type="button" onClick={() => setIsAddingUser(!isAddingUser)}>Отмена</Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </form>
            </div>
            <DeleteModal open={isDeletingModel} onNo={() => {
                setIsDeletingModel(false)
            }} onYes={onConfirmDeletingUser}></DeleteModal>
        </>

    )
}