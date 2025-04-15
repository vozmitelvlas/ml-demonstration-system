import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "../SignInUp.module.css"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {signUpSchema} from "../../../store/formSchema.jsx";
import {useDispatch, useSelector} from "react-redux";
import {registerUserAction} from "../../../../actions/auth-actions.js";
import {setAcceptMessageAction} from "../../../../actions/message-actions.js";
import {selectMessageState} from "../../../../selectors/message-selector.js";

const signInFormData = {
    login: "",
    email: "",
    firstName: "",
    lastName: "",
    patronymic: "",
    password: "",
    repeatPassword: "",
    description: ""
}

export default function SignUp({setIsConfirmed}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {message} = useSelector(selectMessageState)
    const [isSend, setIsSend] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const signUpForm = useForm({
        defaultValues: signInFormData,
        resolver: yupResolver(signUpSchema)
    })

    const firstErrorKey = Object.keys(signUpForm.formState.errors)[0]
    const error = firstErrorKey ? signUpForm.formState.errors[firstErrorKey].message : ''

    const onSignIn = () => navigate("/")

    const sendFormData = (formData) => {
        setIsLoading(true)

        dispatch(registerUserAction(formData)).then(() => {
            setIsSend(true)
            dispatch(setAcceptMessageAction("Мы отправили письмо вам на почту. Перейдите по ссылке, чтобы активировать аккаунт."))
            setIsConfirmed(false)
        }).catch(error => {
            if (error.status === 409)
                signUpForm.setError('form', {type: 'server', message: error.detail})
        }).finally(() =>
            setIsLoading(false)
        )
    }

    return (
        <>
            {isLoading ? (
                <div className={styles.loader}></div>
            ) : (
                <div className={styles.signInUp}>
                    <form onSubmit={signUpForm.handleSubmit(sendFormData)} className={styles.container}>
                        <div className={`${styles.upData} naked-input`}>
                            <h2>Регистрация в ML models</h2>
                            <div className={`${styles.row}`}>
                                <div className={styles.inputDiv}>
                                    <label>Фамилия<span> *</span></label>
                                    <div>
                                        <input type="text" placeholder="Иванов" {...signUpForm.register("lastName")}
                                               required/>
                                    </div>
                                </div>
                                <div className={styles.inputDiv}>
                                    <label>Имя<span> *</span></label>
                                    <div>
                                        <input type="text" placeholder="Иван" {...signUpForm.register("firstName")}
                                               required/>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputDiv}>
                                    <label>Отчество</label>
                                    <div>
                                        <input type="text"
                                               placeholder="Иванович" {...signUpForm.register("patronymic")}/>
                                    </div>
                                </div>

                                <div className={styles.inputDiv}>
                                    <label>Логин<span> *</span></label>
                                    <div>
                                        <input type="text" placeholder="ivan_ivanov" {...signUpForm.register("login")}
                                               required/>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputDiv}>
                                    <label>Электронная почта<span> *</span></label>
                                    <div>
                                        <input type="email"
                                               placeholder="example@mail.ru" {...signUpForm.register("email")}
                                               required/>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputDiv}>
                                    <label>Пароль<span> *</span></label>
                                    <div>
                                        <input type="password" placeholder="******" {...signUpForm.register("password")}
                                               required/>
                                    </div>
                                </div>

                                <div className={styles.inputDiv}>
                                    <label>Повторите пароль<span> *</span></label>
                                    <div>
                                        <input type="password"
                                               placeholder="******" {...signUpForm.register("repeatPassword")}
                                               required/>
                                    </div>
                                </div>
                            </div>

                            {error && <span>{error}</span>}

                            {isSend && <p className={styles.emailConfirm}>{message}</p>}

                            <div className={styles.row}>
                                <div className={styles.button}>
                                    <div>
                                        <button type="submit">Зарегистрироваться</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p>Если есть аккант,
                            <span className={styles.password} onClick={onSignIn}> войдите</span>
                        </p>
                    </form>
                </div>
            )}
        </>

    )
}