import React, {useEffect, useState} from 'react';
import styles from "./PesonalCabinet.module.css"
import Button from "../Button/Button.jsx";
import user_logo from "../../../assets/user2.svg";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {personalCabinetSchema} from "../../store/formSchema.jsx";
import apiClient from "../../utils/axios.jsx";
import SetNewPassword from "./SetNewPassword.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";
import {useNavigate} from "react-router-dom";
import alarmLogo from "../../../assets/alarm.svg";
import acceptLogo from "../../../assets/accept.svg"
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import EditUserData from "./EditUserData.jsx";



export default function PersonalCabinet({userData, setUserData}) {
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false);
    const [passwordChanging, setPasswordChanging] = useState(false)
    const [isDeletingProfile, setIsDeletingProfile] = useState(false)
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)

    const dataForEdit = {
        login: userData?.login,
        email: userData?.email,
        lastName: userData?.lastName,
        firstName: userData?.firstName,
        patronymic: userData?.patronymic,
        description: userData?.description,
    }

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        resolver: yupResolver(personalCabinetSchema),
        defaultValues: dataForEdit
    })

    const openCloseDeleteModal = () => {
        setIsDeletingProfile(!isDeletingProfile)
    }

    const openClosePasswordModal = () => {
        setPasswordChanging(!passwordChanging)
    }

    const openCloseEditModal = () => {
        reset(dataForEdit)
        setIsEditing(!isEditing)
    }
    useEffect(() => {
        if (!userData) {
            apiClient.get(`/api/users/${sessionStorage.getItem("userId")}`).then((res) => {
                setUserData(res.data)
                reset({
                    login: res.data?.login,
                    email: res.data?.email,
                    lastName: res.data?.lastName,
                    firstName: res.data?.firstName,
                    patronymic: res.data?.patronymic,
                    description: res.data?.description

                })
            }).catch(error => {
                console.error(error)
            })
        }
    }, [userData]);

    const onSaveUserData = async (newUserData) => {
        try {
            const res = await apiClient.put(`/api/admin/users/${userData.userId}`, {
                ...newUserData,
                roles: userData.roles
            })
            setUserData(res.data)
            setIsEditing(!isEditing)
        } catch (error) {
            console.log(error)
        }
    }
    const onConfirmDeleteProfile = async () => {
        try {
            await apiClient.delete(`/api/users/profile`)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.personalCabinet}>
            <div className={styles.userOptions}>
                <a className="a-img"><img className={styles.logo} src={user_logo} alt="Пользовательский логотип"></img></a>
                <Button onClick={openCloseEditModal}>Редактировать профиль</Button>
                <Button onClick={openClosePasswordModal}>Сменить пароль</Button>
                <Button onClick={openCloseDeleteModal}>Удалить профиль</Button>
            </div>

            <div>
                <table className={styles.table}>
                    <tbody>
                    <tr>
                        <td>Логин</td>
                        <td>{userData?.login}</td>
                    </tr>
                    <tr>
                        <td>Фамилия</td>
                        <td>{userData?.lastName}</td>
                    </tr>
                    <tr>
                        <td>Имя</td>
                        <td>{userData?.firstName}</td>
                    </tr>
                    <tr>
                        <td>Отчество</td>
                        <td>{userData?.patronymic}</td>
                    </tr>
                    <tr>
                        <td>E-mail</td>
                        <td>{userData?.email}</td>
                    </tr>

                    <tr>
                        <td>Описание</td>
                        <td>
                            <textarea disabled value={userData?.description ? userData?.description : ""}></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <EditUserData
                isEditing={isEditing}
                submitFunction={onSaveUserData}
                handleSubmit={handleSubmit}
                onCancel={openCloseEditModal}
                register={register}
                >
            </EditUserData>

            <SetNewPassword
                passwordChanging={passwordChanging}
                setPasswordChanging={setPasswordChanging}>
            </SetNewPassword>

            <DeleteModal
                open={isDeletingProfile}
                onNo={openCloseDeleteModal}
                onYes={onConfirmDeleteProfile}>
            </DeleteModal>
        </div>
    );
};