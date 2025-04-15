import CatalogHeader from "../Headers/CatalogHeader/CatalogHeader.jsx";
import Button from "../Buttons/Button.jsx";
import React, {useEffect, useState} from "react";
import Filter from "../Filter/Filter.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {addNewUserSchema} from "../../store/formSchema.jsx";
import {Users, AddNewUserModal} from "./components/index.js";
import {NavigateButtons} from "../Buttons/NavigateButtons.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    resetMessageStateAction,
    setAcceptMessageAction,
    setRejectMessageAction
} from "../../../actions/message-actions.js";
import {selectMessageState} from "../../../selectors/message-selector.js";
import {
    addUserAction, changeUserAccessAction, deleteUserByIdAction, getUsersAction
} from "../../../actions/admin-user-actions.js";


export default function CatalogUsers() {
    const dispatch = useDispatch()
    const {message, logo} = useSelector(selectMessageState)
    const [isOpen, setIsOpen] = useState(false)
    const [tmpUserId, setTmpUserId] = useState("")
    const [isAddingUser, setIsAddingUser] = useState(false)
    const [isDeletingUser, setIsDeletingUser] = useState(false)
    const form = useForm({
        resolver: yupResolver(addNewUserSchema),
        defaultValues: {
            login: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            patronymic: "",
            organization: null,
            selectRoles: [],
        }
    })

    useEffect(() => {
        dispatch(resetMessageStateAction)
        dispatch(getUsersAction)
    }, [])

    const firstErrorKey = Object.keys(form.formState.errors)[0];
    useEffect(() => {
        if (firstErrorKey)
            dispatch(setRejectMessageAction(form.formState.errors[firstErrorKey].message))
    }, [firstErrorKey])

    const onDeleteUserClick = (event) => {
        const tr = event.target.closest("tr")
        setTmpUserId(tr.dataset.id)
        setIsDeletingUser(!isDeletingUser)
        dispatch(resetMessageStateAction)
    }

    const onConfirmDeletingUser = () => {
        dispatch(deleteUserByIdAction(tmpUserId)).then(() => {
            setIsDeletingUser(!isDeletingUser)
            dispatch(setAcceptMessageAction("Пользователь успешно удален"))
        })
    }
    const onAddNewUser = (newValue) => {
        const payload = {
            ...newValue,
            organizationId: newValue.organization.value,
            roles: newValue["selectRoles"].map(role => role.value),
            emailConfirm: true,
            active: true,
        }
        dispatch(addUserAction(payload)).then(() => {
            form.reset()
            setIsAddingUser(!isAddingUser)
            dispatch(setAcceptMessageAction("Пользователь успешно создан"))
        }).catch(error => {
            if (error.status === 409)
                form.setError('form', {type: 'server', message: error.detail})
        })
    }

    const onCancelAddingUser = () => {
        setIsAddingUser(!isAddingUser)
        dispatch(resetMessageStateAction)
    }

    const onSetActive = ({target}) => {
        const tr = event.target.closest("tr")
        const userId = tr.dataset.id
        const payload = {
            id: userId,
            body: {isActive: target.checked}
        }
        dispatch(changeUserAccessAction(payload))
    }
    const onAddUserClick = () => {
        setIsAddingUser(!isAddingUser)
        dispatch(resetMessageStateAction)
    }
    const onCloseDeleteModal = () => setIsDeletingUser(false)

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
                    }}/>
            }
            <main>
                <CatalogHeader title={"Каталог пользователей"} searchFields={["Почта", "Фамилия"]}/>

                <div className="options-buttons_up">
                    <Button onClick={onAddUserClick}>Добавить пользователя</Button>
                </div>
                <AlarmMsg logo={logo}>{message}</AlarmMsg>

                <Users onDeleteUserClick={onDeleteUserClick} onSetActive={onSetActive}/>

                <NavigateButtons setIsOpen={setIsOpen}/>
            </main>

            <AddNewUserModal
                form={form}
                submitFunction={onAddNewUser}
                isAddingUser={isAddingUser}
                onCancel={onCancelAddingUser}
            />

            <DeleteModal
                open={isDeletingUser}
                onNo={onCloseDeleteModal}
                onYes={onConfirmDeletingUser}
            />
        </>

    )
}