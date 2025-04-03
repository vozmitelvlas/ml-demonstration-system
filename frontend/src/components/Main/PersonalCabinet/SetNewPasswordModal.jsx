import React, {useState} from "react";
import styles from "./SetNewPassword.module.css"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {setNewPasswordSchema} from "../../store/formSchema.jsx";
import Button from "../Buttons/Button.jsx";
import alarmLogo from "../../../assets/alarm.svg";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import apiClient from "../../utils/apiClient.jsx";
import acceptLogo from "../../../assets/accept.svg"

const passwords = {
    oldPassword: "",
    newPassword: "",
    repeatNewPassword: ""
}

export default function SetNewPasswordModal({setPasswordChanging, passwordChanging, setLogo, setAlarm, alarm, logo}) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setError
    } = useForm({
        defaultValues: passwords,
        resolver: yupResolver(setNewPasswordSchema)
    })

    const firstErrorKey = Object.keys(errors)[0];
    const error = firstErrorKey ? errors[firstErrorKey].message : ''

    const sendFormData = async (newValue) => {
        console.log(newValue, {
            oldPassword: newValue.oldPassword,
            newPassword: newValue.newPassword
        })

        try {
            await apiClient(`/api/users/profile/password`, 'PUT', {
                oldPassword: newValue.oldPassword,
                newPassword: newValue.newPassword
            })
            setPasswordChanging(!passwordChanging)
            setAlarm("Пароль успешно изменен")
            setLogo(acceptLogo)
        } catch (error) {
            if (error.status === 401) {
                setError('form', {type: 'server', message: error.detail})
            } else {
                console.log(error)
            }
        }
    }

    return (
        <>
            <div className={`edit-modal-overlay ${passwordChanging ? "" : "edit-modal-overlay_hidden"}`}>
                <form onSubmit={handleSubmit(sendFormData)} className={styles.container}>
                    <div className={`${styles.data} naked-input`}>
                        <h3>Установка нового пароля</h3>
                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Укажите текущий пароль<span> *</span></label>
                                <div>
                                    <input type="password" placeholder="******" {...register("oldPassword")}
                                           required/>
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Введите новый пароль<span> *</span></label>
                                <div>
                                    <input type="password" placeholder="******" {...register("newPassword")}
                                           required/>
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Повторите новый пароль<span> *</span></label>
                                <div>
                                    <input type="password" placeholder="******" {...register("repeatNewPassword")}
                                           required/>
                                </div>
                            </div>
                        </div>

                        {error && <span>{error}</span>}

                        <div className={styles.row}>
                            <div className={styles.buttons}>
                                <Button type="button" onClick={() => {
                                    setPasswordChanging(false)
                                    reset(passwords)
                                }}>Отмена</Button>
                                <Button type="submit">Установить</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}