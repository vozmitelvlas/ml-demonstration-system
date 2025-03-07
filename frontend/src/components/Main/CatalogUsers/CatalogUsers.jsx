import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../Button/Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Filter from "../Filter/Filter.jsx";

import DeleteModal from "../../utils/DeleteModal.jsx";
import apiClient from "../../utils/apiClient.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import alarmLogo from "../../../assets/alarm.svg";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import acceptLogo from "../../../assets/accept.svg"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {signUpSchema} from "../../store/formSchema.jsx";
import AddNewUserModal from "./AddNewUserModal.jsx";


export default function CatalogUsers() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [tmpUserId, setTmpUserId] = useState("")
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)
    const [users, setUsers] = useState([])
    const [isAddingUser, setIsAddingUser] = useState(false)
    const [isDeletingUser, setIsDeletingUser] = useState(false)
    const [isAddedUser, setIsAddedUser] = useState(false)
    const [isDeletedUser, setIsDeletedUser] = useState(false)
    const [orgOptions, setOrgOptions] = useState([])
    const form = useForm({
        resolver: yupResolver(signUpSchema),
        defaultValues: {
            login: "",
            password: "",
            email: "",
            firstName: "",
            lastName: "",
            patronymic: "",
            organization: null,
            selectRoles: [],
            description: "",
        }
    })

    useEffect(() => {
        apiClient('/api/admin/users').then((res) => {
            setUsers(res)
        }).catch(error => {
            console.error(error)
        })
    }, [isDeletedUser, isAddedUser])

    useEffect(() => {
        apiClient(`/api/admin/organizations`).then((res) => {
            const organisations = []
            res.forEach(org => {
                organisations.push({value: org.organizationId, label: org.name})
            })
            setOrgOptions(organisations)
        }).catch(error => {
            console.log(error)
        })
    }, []);

    const firstErrorKey = Object.keys(form.formState.errors)[0];
    useEffect(() => {
        if (firstErrorKey) {
            setLogo(alarmLogo)
            setAlarm(form.formState.errors[firstErrorKey].message)
        }
    }, [firstErrorKey])

    const onDeleteUserClick = (event) => {
        const tr = event.target.closest("tr")
        setTmpUserId(tr.dataset.id)
        setIsDeletingUser(!isDeletingUser)
        setAlarm(null)
    }
    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const onConfirmDeletingUser = async () => {
        try {
            await apiClient(`/api/admin/users/${tmpUserId}`, "DELETE");
            setAlarm("Пользователь успешно удален")
            setLogo(acceptLogo)
            setIsDeletingUser(!isDeletingUser)
            setIsDeletedUser(true)
        } catch (error) {
            console.error(error)
        }
    }
    const onSaveUserData = async (newValue) => {
        console.log(newValue)

        const sendData = {
            ...newValue,
            organizationId: newValue.organization.value,
            roles: newValue["selectRoles"].map(role => role.value)
        }

        try {
            await apiClient(`/api/admin/users`, "POST", sendData)

            setAlarm("Пользователь успешно создан")
            setLogo(acceptLogo)
            form.reset({})
            setIsAddingUser(!isAddingUser)
            setIsAddedUser(true)
        } catch (error) {
            if (error.status === 409) {
                form.setError('form', {type: 'server', message: error.detail})
            } else {
                console.log(error)
            }
        }
    }

    const onCancelAddingUser = () => {
        setIsAddingUser(!isAddingUser)
        setAlarm(null)
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
                <AlarmMsg logo={logo}>{alarm}</AlarmMsg>

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

            <AddNewUserModal
                form={form}
                submitFunction={onSaveUserData}
                isAddingUser={isAddingUser}
                logo={logo}
                alarm={alarm}
                orgOptions={orgOptions}
                onCancel={onCancelAddingUser}
            ></AddNewUserModal>

            <DeleteModal
                open={isDeletingUser}
                onNo={() => setIsDeletingUser(false)}
                onYes={onConfirmDeletingUser}
            ></DeleteModal>
        </>

    )
}