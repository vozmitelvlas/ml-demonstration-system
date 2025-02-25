import React from "react";
import styles from "./SetNewPassword.module.css"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {setNewPasswordSchema} from "../../store/formSchema.jsx";
import Button from "../Button/Button.jsx";

export default function SetNewPassword({setPasswordChanging, passwordChanging}) {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            password: "",
            newPassword: "",
            repeatNewPassword: ""
        },
        resolver: yupResolver(setNewPasswordSchema)
    })

    const firstErrorKey = Object.keys(errors)[0];
    const error = firstErrorKey ? errors[firstErrorKey].message : ''

    const sendFormData = (newPasswordData) => {
        console.log(newPasswordData)
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
                                    <input type="password" placeholder="******" {...register("password")}
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
                                <Button type="button" onClick={() => setPasswordChanging(false)}>Отмена</Button>
                                <Button type="submit">Установить</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}