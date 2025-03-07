import React from "react";
import {useNavigate} from "react-router-dom";
import styles from "./SignIn.module.css"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {signUpSchema} from "../../store/formSchema.jsx";
import ApiClient from "../../utils/apiClient.jsx";


export default function SignUp({setUserData, setIsAdmin, setMainOrg}) {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
        getValues
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

    const firstErrorKey = Object.keys(errors)[0];
    const error = firstErrorKey ? errors[firstErrorKey].message : ''

    const sendFormData = async (formData) => {
        try {
            const {user} = await ApiClient('/api/auth/register', 'POST', formData)
            setUserData(user)
            navigate("/models")
            setIsAdmin(user.roles.includes("ADMIN"))
            setMainOrg(user.roles.includes("ORGANIZATION_HEAD"))

        } catch (error) {
            if (error.status === 409) {
                setError('form', {type: 'server', message: error.detail})
            } else {
                console.log(error)
            }
        }
    }

    return (
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
                                <input type="email" placeholder="example@mail.ru" {...register("email")} required/>
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
    )
}