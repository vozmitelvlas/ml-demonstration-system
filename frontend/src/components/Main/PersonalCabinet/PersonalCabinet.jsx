import React, {useEffect, useState} from 'react';
import styles from "./PesonalCabinet.module.css"
import Button from "../Buttons/Button.jsx";
import user_logo from "../../../assets/user2.svg";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {personalCabinetSchema, setNewPasswordSchema} from "../../store/formSchema.jsx";
import {SetNewPasswordModal, EditUserDataModal, UserData} from "./components";
import DeleteModal from "../../utils/DeleteModal.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectUserData} from "../../../selectors/user-selector.js";
import {deleteUserAsUserAction, getUserProfileAction, updateUserDataAsUserAction} from "../../../actions/user-actions.js";
import {
    resetMessageStateAction,
    setAcceptMessageAction,
    setRejectMessageAction
} from "../../../actions/message-actions.js";

const passwordFormData = {
    oldPassword: "",
    newPassword: "",
    repeatNewPassword: ""
}
const userFormData = (userData) => ({
    login: userData.login,
    email: userData.email,
    lastName: userData.lastName,
    firstName: userData.firstName,
    patronymic: userData.patronymic,
    description: userData.description,
})

export default function PersonalCabinet() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userData = useSelector(selectUserData)
    const [isEditing, setIsEditing] = useState(false)
    const [passwordChanging, setPasswordChanging] = useState(false)
    const [isDeletingProfile, setIsDeletingProfile] = useState(false)
    const userForm = useForm({
        resolver: yupResolver(personalCabinetSchema)
    })
    const passwordForm = useForm({
        resolver: yupResolver(setNewPasswordSchema)
    })

    useEffect(() => {
        dispatch(getUserProfileAction)
        dispatch(resetMessageStateAction)

        const firstErrorKey = Object.keys(userForm.formState.errors)[0];
        if (firstErrorKey) {
            dispatch(setRejectMessageAction(userForm.formState.errors[firstErrorKey].message))
        }
    }, [userForm.formState.errors])

    const openCloseDeleteModal = () => {
        dispatch(resetMessageStateAction)
        setIsDeletingProfile(!isDeletingProfile)
    }

    const openClosePasswordModal = () => {
        if(!passwordChanging)
            passwordForm.reset(passwordFormData)
        dispatch(resetMessageStateAction)
        setPasswordChanging(!passwordChanging)
    }

    const openCloseEditModal = () => {
        if (!isEditing)
            userForm.reset(userFormData(userData))
        dispatch(resetMessageStateAction)
        setIsEditing(!isEditing)
    }

    const onSaveUserData = (newUserData) => {
        dispatch(updateUserDataAsUserAction(newUserData)).then(() => {
            setIsEditing(!isEditing)
            dispatch(setAcceptMessageAction("Изменения успешно сохранены"))
        })
    }
    const onConfirmDeleteProfile = () => {
        dispatch(deleteUserAsUserAction()).then(() =>
            navigate("/")
        )
    }

    return (
        <div className={styles.personalCabinet}>
            <div className={styles.userOptions}>
                <a className="a-img"><img className={styles.logo} src={user_logo} alt="Пользовательский логотип"></img></a>
                <Button onClick={openCloseEditModal}>Редактировать профиль</Button>
                <Button onClick={openClosePasswordModal}>Сменить пароль</Button>
                <Button onClick={openCloseDeleteModal}>Удалить профиль</Button>
            </div>

            <UserData />

            <EditUserDataModal
                isEditing={isEditing}
                submitFunction={onSaveUserData}
                handleSubmit={userForm.handleSubmit}
                onCancel={openCloseEditModal}
                register={userForm.register}/>

            <SetNewPasswordModal
                passwordChanging={passwordChanging}
                setPasswordChanging={setPasswordChanging}
                passwordForm={passwordForm}/>

            <DeleteModal
                open={isDeletingProfile}
                onNo={openCloseDeleteModal}
                onYes={onConfirmDeleteProfile}/>
        </div>
    );
};