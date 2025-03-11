import React, {useEffect, useState} from 'react';
import styles from "./PesonalCabinet.module.css"
import Button from "../Button/Button.jsx";
import user_logo from "../../../assets/user2.svg";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {personalCabinetSchema} from "../../store/formSchema.jsx";
import apiClient from "../../utils/apiClient.jsx";
import SetNewPasswordModal from "./SetNewPasswordModal.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";
import {useNavigate} from "react-router-dom";
import alarmLogo from "../../../assets/alarm.svg";
import acceptLogo from "../../../assets/accept.svg"
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import EditUserDataModal from "./EditUserDataModal.jsx";

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

    useEffect(() => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            setLogo(alarmLogo)
            setAlarm(errors[firstErrorKey].message)
        }
    }, [errors]);

    const openCloseDeleteModal = () => {
        setAlarm(null)
        setIsDeletingProfile(!isDeletingProfile)
    }

    const openClosePasswordModal = () => {
        setAlarm(null)
        setPasswordChanging(!passwordChanging)
    }

    const openCloseEditModal = () => {
        reset(dataForEdit)
        setAlarm(null)
        setIsEditing(!isEditing)
    }
    useEffect(() => {
        if (!userData) {
            apiClient(`/api/users/profile`).then((res) => {
                setUserData(res)
                reset({
                    login: res.login,
                    email: res.email,
                    lastName: res.lastName,
                    firstName: res.firstName,
                    patronymic: res.patronymic,
                    description: res.description
                })
            }).catch(error => {
                console.error(error)
            })
        }
    }, []);

    const onSaveUserData = async (newUserData) => {
        try {
            const res = await apiClient(`/api/users/profile`, 'PUT', {
                ...newUserData,
                roles: userData.roles
            })
            setUserData(res)
            setIsEditing(!isEditing)

            setLogo(acceptLogo)
            setAlarm("Изменения успешно сохранены")
        } catch (error) {
            console.log(error)
        }
    }
    const onConfirmDeleteProfile = async () => {
        try {
            await apiClient(`/api/users/profile`, 'DELETE')
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

            <div className={styles.userData}>
                <AlarmMsg logo={logo}>{alarm}</AlarmMsg>
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
                            <textarea
                                id={styles.description}
                                value={userData?.description ? userData?.description : ""}
                                disabled
                            ></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <EditUserDataModal
                isEditing={isEditing}
                submitFunction={onSaveUserData}
                handleSubmit={handleSubmit}
                onCancel={openCloseEditModal}
                register={register}
                logo={logo}
                alarm={alarm}
            ></EditUserDataModal>

            <SetNewPasswordModal
                passwordChanging={passwordChanging}
                setPasswordChanging={setPasswordChanging}
                setLogo={setLogo}
                setAlarm={setAlarm}
                logo={logo}
                alarm={alarm}
            ></SetNewPasswordModal>

            <DeleteModal
                open={isDeletingProfile}
                onNo={openCloseDeleteModal}
                onYes={onConfirmDeleteProfile}>
            </DeleteModal>
        </div>
    );
};