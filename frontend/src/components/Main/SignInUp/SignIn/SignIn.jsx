import styles from "../SignInUp.module.css"
import React from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {signInSchema} from "../../../store/formSchema.jsx";
import {loginUserAction} from "../../../../actions/auth-actions.js";
import {useDispatch} from "react-redux";
import {resetMessageStateAction} from "../../../../actions/message-actions.js";

export default function SignIn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const signInForm = useForm({
        defaultValues: {
            login: "",
            password: "",
        },
        resolver: yupResolver(signInSchema)
    })

    const onInputFocus = () => dispatch(resetMessageStateAction)

    const firstErrorKey = Object.keys(signInForm.formState.errors)[0]
    const error = firstErrorKey ? signInForm.formState.errors[firstErrorKey].message : ''

    const sendFormData = (formData) => {
        dispatch(loginUserAction(formData)).then(() =>
            navigate("/models")
        ).catch(error =>
            signInForm.setError('form', {type: 'server', message: error.detail})
        )
    }

    return (
        <div className={styles.signInUp}>
            <form onSubmit={signInForm.handleSubmit(sendFormData)} className={styles.container}>
                <div className={`${styles.inData} naked-input`}>
                    <h2>Вход в ML models</h2>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Логин"
                                    {...signInForm.register("login")}
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
                                    {...signInForm.register("password")}
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