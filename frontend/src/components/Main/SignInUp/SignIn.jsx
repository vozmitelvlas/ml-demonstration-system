import styles from "./SignIn.module.css"
import React from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {signInSchema} from "../../store/formSchema.jsx";

export default function SignIn({setUserData}) {
    const navigate = useNavigate()
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

    const firstErrorKey = Object.keys(errors)[0];
    const error = firstErrorKey ? errors[firstErrorKey].message : ''

    const sendFormData = async (formData) => {
        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', formData)
            setUserData(res.data.user)
            sessionStorage.setItem("accessToken", res.data.accessToken)
            sessionStorage.setItem("userId", res.data.user.userId)
            navigate("/models")
        } catch (error) {
            if (error.response?.status === 401) {
                setError('form', {type: 'server', message: 'Неверный логин или пароль'})
            } else {
                console.log(error)
            }
        }
    }

    return (
        <div className={styles.signInUp}>
            <form onSubmit={handleSubmit(sendFormData)} className={styles.container}>
                <div className={`${styles.inData} naked-input`}>
                    <h2>Вход в ML models</h2>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <div>
                                <input type="text" placeholder="Логин" {...register("login")} required/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <div>
                                <input type="password" placeholder="Пароль" {...register("password")} required/>
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