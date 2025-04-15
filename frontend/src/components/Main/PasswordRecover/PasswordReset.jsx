import styles from "./PasswordRecover.module.css";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {passwordResetSchema} from "../../store/formSchema.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logOutAction} from "../../../actions/auth-actions.js";
import {sendNewPasswordWithTokenAction} from "../../../actions/user-actions.js";

export default function PasswordReset() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [token, setToken] = useState('')
    const passwordForm = useForm({
        resolver: yupResolver(passwordResetSchema),
        defaultValues: {
            password: "",
            repeatPassword: "",
        }
    })

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const tokenFromUrl = urlParams.get('token')
        if (tokenFromUrl) {
            setToken(tokenFromUrl)
        }
    }, [])


    const onResetPassword = (newValue) => {
        const payload = {
            body: {password: newValue.password},
            token: token
        }
        dispatch(logOutAction).then(() =>
            dispatch(sendNewPasswordWithTokenAction(payload)).then(() => {
                navigate("/")
            })
        )
    }

    const firstErrorKey = Object.keys(passwordForm.formState.errors)[0]
    const error = firstErrorKey ? passwordForm.formState.errors[firstErrorKey].message : ''

    return (
        <div className={styles.signInUp}>
            <form onSubmit={passwordForm.handleSubmit(onResetPassword)} className={styles.container}>
                <div className={`${styles.inData} naked-input`}>
                    <h2>Восстановление доступа</h2>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <label>Новый пароль<span> *</span></label>
                            <div>
                                <input type="password" placeholder="******" {...passwordForm.register("password")}
                                       required/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <label>Повторите пароль<span> *</span></label>
                            <div>
                                <input type="password"
                                       placeholder="******" {...passwordForm.register("repeatPassword")}
                                       required/>
                            </div>
                        </div>
                    </div>

                    {error && <span>{error}</span>}
                    <div className={styles.row}>
                        <div className={styles.button}>
                            <div>
                                <button type="submit">Восстановить</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p>
                        Вспомнили пароль?
                        <span className={styles.password}
                              onClick={() => navigate("/")}> Вернитесь</span>
                    </p>
                </div>
            </form>
        </div>
    )
}