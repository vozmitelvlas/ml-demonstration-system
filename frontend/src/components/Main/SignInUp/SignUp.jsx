import React from "react";
import {useNavigate} from "react-router-dom";
import styles from "./SignIn.module.css"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import axios from "axios";
import {setUserInfo} from "../../store/user-slice.jsx";
import {useDispatch} from "react-redux";
import {signUpSchema} from "../../store/formSchema.jsx";


export default function SignUp() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError
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
        console.log(formData)
        try {
            await axios
                .post('http://localhost:8080/api/auth/register', formData)
                .then((res) => {
                    dispatch(setUserInfo(res.data))
                    localStorage.setItem("login", formData.login);
                    localStorage.setItem("password", formData.password);
                });

            navigate("/models")
        } catch (serverError) {
            if (serverError.response.status === 409) {
                setError('form', { type: 'server', message: 'Пользователь с таким логином уже существует' })
            }
        }
        // () => navigate("/models")
    }

    return (
        <div className={styles.signInUp}>
            <div className={styles.container}>
                <form onSubmit={handleSubmit(sendFormData)}>
                    <div className={styles.data}>
                        <p className="text-class">Регистрация</p>
                        <input type="text" placeholder="Логин" {...register("login")}/>
                        <input type="text" placeholder="Фамилия" {...register("lastName")}/>
                        <input type="text" placeholder="Имя" {...register("firstName")}/>
                        <input type="text" placeholder="Отчество" {...register("patronymic")}/>
                        <input type="email" placeholder="E-mail" {...register("email")}/>
                        <input type="password" placeholder="Пароль" {...register("password")}/>
                        <input type="password" placeholder="Повторите пароль" {...register("repeatPassword")}/>
                        {error && <span>{error}</span>}
                    </div>

                    <div>
                        <button type="submit" className={styles.button}>Зарегистрироваться
                        </button>
                        <p>Если есть аккант,
                            <span className={styles.password} onClick={() => navigate("/")}>войдите</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}