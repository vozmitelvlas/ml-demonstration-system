import React, {useEffect, useState} from 'react';
import styles from "./PesonalCabinet.module.css"
import Button from "../Button/Button.jsx";
import user_logo from "../../../assets/user2.svg";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {personalCabinetSchema} from "../../store/formSchema.jsx";
import apiClient from "../../utils/axios.jsx";
import SetNewPassword from "./SetNewPassword.jsx";


export default function PersonalCabinet({userData, setUserData}) {
    const [isEditing, setIsEditing] = useState(false);
    const [passwordChanging, setPasswordChanging] = useState(false)

    const openClosePasswordModal = () => {
        setPasswordChanging(!passwordChanging)
    }

    const openCloseEditModal = () => {
        setIsEditing(!isEditing)
    }
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        resolver: yupResolver(personalCabinetSchema),
        defaultValues: {
            login: userData?.login,
            email: userData?.email,
            lastName: userData?.lastName,
            firstName: userData?.firstName,
            patronymic: userData?.patronymic,
            description: userData?.description,
        }
    })

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

    return (
        <div className={styles.personalCabinet}>
            <div className={styles.userOptions}>
                <a className="a-img"><img className={styles.logo} src={user_logo} alt="Пользовательский логотип"></img></a>
                <Button onClick={openCloseEditModal}>Редактировать профиль</Button>
                <Button onClick={openClosePasswordModal}>Сменить пароль</Button>
                <Button>Удалить профиль</Button>
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
                            <textarea disabled value={userData?.description}></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className={`edit-modal-overlay ${isEditing ? "" : "edit-modal-overlay_hidden"}`}>
                <form onSubmit={handleSubmit(onSaveUserData)} className={styles.container}>
                    <h3>Редактирование данных</h3>
                    <table className="change-container__table naked-input">
                        <tbody>
                        <tr>
                            <td>Логин</td>
                            <td className="text-center">
                                <input type="text" {...register("login")} disabled/>
                            </td>
                        </tr>
                        <tr>
                            <td>E-mail</td>
                            <td className="text-center">
                                <input type="text" {...register("email")} disabled/>
                            </td>
                        </tr>
                        <tr>
                            <td>Фамилия</td>
                            <td className="text-center">
                                <input type="text" {...register("lastName")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Имя</td>
                            <td className="text-center">
                                <input type="text" {...register("firstName")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Отчество</td>
                            <td className="text-center">
                                <input type="text" {...register("patronymic")}/>
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
                    <div className="edit-modal__buttons">
                        <Button type="button" onClick={openCloseEditModal}>Отмена</Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </form>
            </div>

            <div className={`edit-modal-overlay ${passwordChanging ? "" : "edit-modal-overlay_hidden"}`}>
                <SetNewPassword setPasswordChanging={setPasswordChanging}></SetNewPassword>
            </div>
        </div>
    );
};