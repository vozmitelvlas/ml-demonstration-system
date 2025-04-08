import styles from "./PasswordRecover.module.css";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {passwordResetSchema} from "../../store/formSchema.jsx";
import apiClient from "../../utils/apiClient.jsx";
import {useNavigate} from "react-router-dom";

export default function PasswordReset() {
    const navigate = useNavigate()
    const [token, setToken] = useState('')

    const {
        handleSubmit,
        formState: {errors},
        register,
    } = useForm({
        resolver: yupResolver(passwordResetSchema),
        defaultValues: {
            password: "",
            repeatPassword: "",
        }
    })

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const tokenFromUrl = urlParams.get('token')
        console.log(token)

        if (tokenFromUrl) {
            setToken(tokenFromUrl)
        }
    }, []);


    const onResetPassword = async (newValue) => {
        console.log(newValue, token)
        try {
            await apiClient(`/api/auth/logout`)
            await apiClient('/api/users/profile/password/reset', "POST", {password: newValue.password}, {
                Authorization: `Bearer ${token}`})
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    const firstErrorKey = Object.keys(errors)[0];
    const error = firstErrorKey ? errors[firstErrorKey].message : ''

    return (
        <>
            <div className={styles.signInUp}>
                <form onSubmit={handleSubmit(onResetPassword)} className={styles.container}>
                    <div className={`${styles.inData} naked-input`}>
                        <h2>Восстановление доступа</h2>
                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Новый пароль<span> *</span></label>
                                <div>
                                    <input type="password" placeholder="******" {...register("password")} required/>
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Повторите пароль<span> *</span></label>
                                <div>
                                    <input type="password"
                                           placeholder="******" {...register("repeatPassword")}
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
        </>
    )
}