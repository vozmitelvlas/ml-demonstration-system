import React from "react";
import styles from "./SetNewPassword.module.css"
import Button from "../../Buttons/Button.jsx";
import {useDispatch} from "react-redux";
import {updateUserPasswordAction} from "../../../../actions/user-actions.js";
import {setAcceptMessageAction} from "../../../../actions/message-actions.js";


export function SetNewPasswordModal({setPasswordChanging, passwordChanging, passwordForm}) {
    const dispatch = useDispatch()

    const firstErrorKey = Object.keys(passwordForm.formState.errors)[0];
    const error = firstErrorKey ? passwordForm.formState.errors[firstErrorKey].message : ''

    const sendFormData = async (newValue) => {
        const {repeatNewPassword, ...formData} = newValue
        dispatch(updateUserPasswordAction(formData)).then(() => {
            setPasswordChanging(!passwordChanging)
            dispatch(setAcceptMessageAction("Пароль успешно изменен"))
        }).catch(error => {
            if (error.status === 401)
                passwordForm.setError('form', {type: 'server', message: error.detail})
        })
    }

    return (
        <>
            <div className={`edit-modal-overlay ${passwordChanging ? "" : "edit-modal-overlay_hidden"}`}>
                <form onSubmit={passwordForm.handleSubmit(sendFormData)} className={styles.container}>
                    <div className={`${styles.data} naked-input`}>
                        <h3>Установка нового пароля</h3>
                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Укажите текущий пароль<span> *</span></label>
                                <div>
                                    <input type="password"
                                           placeholder="******"
                                           {...passwordForm.register("oldPassword")}
                                           required/>
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Введите новый пароль<span> *</span></label>
                                <div>
                                    <input type="password"
                                           placeholder="******"
                                           {...passwordForm.register("newPassword")}
                                           required/>
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Повторите новый пароль<span> *</span></label>
                                <div>
                                    <input type="password"
                                           placeholder="******"
                                           {...passwordForm.register("repeatNewPassword")}
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