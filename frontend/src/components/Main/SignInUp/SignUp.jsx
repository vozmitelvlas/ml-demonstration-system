import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./SignIn.module.css"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {signUpSchema} from "../../store/formSchema.jsx";
import ApiClient from "../../utils/apiClient.jsx";
import apiClient from "../../utils/apiClient.jsx";
import {getTimeFormat, secondsToMMSS} from "../../utils/DateAndTime.jsx";


export default function SignUp({setUserData}) {
    const navigate = useNavigate()
    const [isConfirm, setIsConfirm] = useState(false)
    const [alarm, setAlarm] = useState("")
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const [timer, setTimer] = useState(60)
    const [userEmail, setUserEmail] = useState("")
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm({
        defaultValues: {
            login: "",
            email: "",
            firstName: "",
            lastName: "",
            patronymic: "",
            password: "",
            repeatPassword: "",
            description: ""
        },
        resolver: yupResolver(signUpSchema)
    })
    useEffect(() => {
        let interval
        if (isButtonDisabled) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer === 1) {
                        clearInterval(interval)
                        setIsButtonDisabled(false)
                        return 0
                    }
                    return prevTimer - 1
                })
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [isButtonDisabled])

    const firstErrorKey = Object.keys(errors)[0];
    const error = firstErrorKey ? errors[firstErrorKey].message : ''

    const sendFormData = async (formData) => {
        try {
            const {user} = await ApiClient('/api/auth/register', 'POST', formData)
            setUserEmail(user.email)
            console.log(user)
            setUserData(user)

            // await apiClient(`/api/auth/email-confirm`, 'POST', {email: formData.email})
            setIsConfirm(true)
            // await apiClient(`/api/auth/logout`)
            setAlarm("Мы отправили письмо вам на почту. Перейдите по ссылке, чтобы активировать аккаунт.")
            // navigate("/models")
        } catch (error) {
            if (error.status === 409) {
                setError('form', {type: 'server', message: error.detail})
            } else {
                console.log(error)
            }
        }
    }
    const onSendEmailLetter = async () => {
        await apiClient(`/api/auth/email-confirm`, 'POST', {email: userEmail})
        setIsButtonDisabled(true)
        setTimer(60)
    }

    return (
        <>

            <div className={styles.signInUp}>
                <form onSubmit={handleSubmit(sendFormData)} className={styles.container}>
                    <div className={`${styles.upData} naked-input`}>
                        <h2>Регистрация в ML models</h2>
                        <div className={`${styles.row}`}>
                            <div className={styles.inputDiv}>
                                <label>Фамилия<span> *</span></label>
                                <div>
                                    <input type="text" placeholder="Иванов" {...register("lastName")}
                                           required/>
                                </div>
                            </div>
                            <div className={styles.inputDiv}>
                                <label>Имя<span> *</span></label>
                                <div>
                                    <input type="text" placeholder="Иван" {...register("firstName")} required/>
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Отчество</label>
                                <div>
                                    <input type="text" placeholder="Иванович" {...register("patronymic")}/>
                                </div>
                            </div>

                            <div className={styles.inputDiv}>
                                <label>Логин<span> *</span></label>
                                <div>
                                    <input type="text" placeholder="ivan_ivanov" {...register("login")} required/>
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Электронная почта<span> *</span></label>
                                <div>
                                    <input type="email" placeholder="example@mail.ru" {...register("email")}
                                           required/>
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputDiv}>
                                <label>Пароль<span> *</span></label>
                                <div>
                                    <input type="password" placeholder="******" {...register("password")} required/>
                                </div>
                            </div>

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
                        {isConfirm && <p className={styles.emailConfirm}>{alarm}</p>}

                        <div className={styles.row}>
                            <div className={styles.button}>
                                <div>
                                    <button type="submit">Зарегистрироваться</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p>Если есть аккант,
                        <span className={styles.password} onClick={() => navigate("/")}> войдите</span>
                    </p>
                </form>
            </div>
        </>

    )
}