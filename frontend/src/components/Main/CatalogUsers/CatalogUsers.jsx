import CatalogHeader from "../Headers/CatalogHeader/CatalogHeader.jsx";
import Button from "../Buttons/Button.jsx";
import React, {useEffect, useState} from "react";
import Filter from "../Filter/Filter.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";
import apiClient from "../../utils/apiClient.jsx";
import alarmLogo from "../../../assets/alarm.svg";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import acceptLogo from "../../../assets/accept.svg"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {signUpSchema} from "../../store/formSchema.jsx";
import {Users, AddNewUserModal} from "./components/index.js";
import {NavigateButtons} from "../Buttons/NavigateButtons.jsx";


export default function CatalogUsers() {
    const [isOpen, setIsOpen] = useState(false)
    const [tmpUserId, setTmpUserId] = useState("")
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)
    const [users, setUsers] = useState([])
    const [isAddingUser, setIsAddingUser] = useState(false)
    const [isDeletingUser, setIsDeletingUser] = useState(false)
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
        }
    })

    useEffect(() => {
        apiClient('/api/admin/users').then((res) => {
            setUsers(res.sort((a, b) => a.userId - b.userId))
        }).catch(error => {
            console.error(error)
        })
    }, [])

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
    }, [])

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

    const onConfirmDeletingUser = async () => {
        try {
            await apiClient(`/api/admin/users/${tmpUserId}`, "DELETE");
            setAlarm("Пользователь успешно удален")
            setLogo(acceptLogo)
            setIsDeletingUser(!isDeletingUser)
            setUsers(users.filter(user => user.userId !== Number(tmpUserId)))
        } catch (error) {
            console.error(error)
        }
    }
    const onAddNewUser = async (newValue) => {
        const sendData = {
            ...newValue,
            organizationId: newValue.organization.value,
            roles: newValue["selectRoles"].map(role => role.value),
            emailConfirm: true,
            active: true,
        }

        try {
            const res = await apiClient(`/api/admin/users`, "POST", sendData)

            setUsers([...users, res])
            setAlarm("Пользователь успешно создан")
            setLogo(acceptLogo)
            form.reset()
            setIsAddingUser(!isAddingUser)
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

    const onSetActive = async ({target}) => {
        try{
            const tr = event.target.closest("tr")
            const userId = tr.dataset.id


            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.userId === Number(userId)
                        ? { ...user, active: target.checked }
                        : user
                )
            )
            await apiClient(`/api/admin/users/${userId}/active`, 'PUT', {isActive: target.checked})
        } catch (error){
            console.log(error)
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
                            options: ["Фамилии (ФИ)", "Логину", "Доступу"],
                            names: ["FI", "login", "access"]
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

                <Users users={users} onDeleteUserClick={onDeleteUserClick} onSetActive={onSetActive}/>

                <NavigateButtons setIsOpen={setIsOpen} isAdminMode={true}/>
            </main>

            <AddNewUserModal
                form={form}
                submitFunction={onAddNewUser}
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