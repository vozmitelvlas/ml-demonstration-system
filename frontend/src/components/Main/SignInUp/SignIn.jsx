import styles from "./SignIn.module.css"
import React from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useDispatch} from "react-redux";
import {setUserInfo} from "../../store/user-slice.jsx";
import {signInSchema} from "../../store/formSchema.jsx";

export default function SignIn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors},
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
            await axios
                .post('http://localhost:8080/api/auth/login', formData)
                .then((res) => {
                    dispatch(setUserInfo(res.data))

                    localStorage.setItem("login", formData.login);
                    localStorage.setItem("password", formData.password);
                });

            navigate("/models")
        } catch (serverError) {
            if (serverError.response.status === 401) {
                setError('form', { type: 'server', message: 'Неверный логин или пароль' })
            }
        }
    }

    return (
        <div className={styles.signInUp}>
            <form onSubmit={handleSubmit(sendFormData)}>
                <div className={styles.container}>
                    <div className={styles.data}>
                        <p className="text-class">Вход</p>
                        <input type="text" placeholder="Логин" {...register("login")}/>
                        <input type="password"placeholder="Пароль" {...register("password")}/>
                        {error && <span>{error}</span>}
                        <button className={styles.button}>Войти</button>
                    </div>

                    <div>
                        <span className={styles.password} onClick={() => navigate("/password")}>Забыли пароль?</span>
                        <p>
                            Нет аккаунта?
                            <span className={styles.password}
                                  onClick={() => navigate("/signup")}> Зарегистрируйтесь</span>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}