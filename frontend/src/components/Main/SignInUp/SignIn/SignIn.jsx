import styles from "../SignInUp.module.css"
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import apiClient from "../../../utils/apiClient.jsx";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {signInSchema} from "../../../store/formSchema.jsx";

export default function SignIn({setUserData, setIsAdmin, setMainOrg, setIsAdminMode}) {
    const navigate = useNavigate()
    const [alarm, setAlarm] = useState("")
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError
    } = useForm({
        defaultValues: {
            login: "",
            password: "",
        },
        resolver: yupResolver(signInSchema)
    })


    const onInputFocus = () => {
        setAlarm("")
    }

    const firstErrorKey = Object.keys(errors)[0];
    const error = firstErrorKey ? errors[firstErrorKey].message : ''

    const sendFormData = async (formData) => {
        try {
            const {user} = await apiClient('/api/auth/login', 'POST', formData)

            setUserData(user)
            setIsAdmin(user.roles.includes("ADMIN"))
            setMainOrg(user.roles.includes("ORGANIZATION_HEAD"))
            navigate("/models")
        } catch (error) {
            setError('form', {type: 'server', message: error.detail})
            console.log(error)
        }
    }

    return (
        <div className={styles.signInUp}>
            <form onSubmit={handleSubmit(sendFormData)} className={styles.container}>
                <div className={`${styles.inData} naked-input`}>
                    <h2>Вход в ML models</h2>
                    {alarm && <span className={styles.emailAlarm}>{alarm}</span>}
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Логин"
                                    {...register("login")}
                                    onFocus={onInputFocus}
                                    required/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Пароль"
                                    {...register("password")}
                                    onFocus={onInputFocus}
                                    required/>
                            </div>
                        </div>
                    </div>

                    {error && <span>{error}</span>}
                    <div className={styles.row}>
                        <div className={styles.button}>
                            <div>
                                <button type="submit">Войти</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <span className={styles.password} onClick={() => navigate("/password")}>Забыли пароль?</span>
                    <p>
                        Нет аккаунта?
                        <span className={styles.password}
                              onClick={() => navigate("/signup")}> Зарегистрируйтесь</span>
                    </p>
                </div>
            </form>
        </div>
    )
}