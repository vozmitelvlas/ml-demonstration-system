import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./SignIn.module.css"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {passwordRecoverSchema} from "../../store/formSchema.jsx";

export default function PasswordRecover() {
    let navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            repeatPassword: "",
        },
        resolver: yupResolver(passwordRecoverSchema)
    })
    const firstErrorKey = Object.keys(errors)[0];
    const error = firstErrorKey ? errors[firstErrorKey].message : ''

    const sendFormData = async (newPasswordData) => {
        console.log(newPasswordData)
        try{

            // navigate("/")
        } catch (error){
            console.log(error)
        }
    }

    return (
        <div className={styles.signInUp}>
            <form onSubmit={handleSubmit(sendFormData)} className={styles.container}>
                <div className={`${styles.inData} naked-input`}>
                    <h2>Восстановление пароля</h2>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <label>Почта<span> *</span></label>
                            <div>
                                <input type="email" placeholder="example@mail.ru" {...register("email")} required/>
                            </div>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <label>Введите новый пароль<span> *</span></label>
                            <div>
                                <input type="password" placeholder="******" {...register("password")}
                                       required/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <label>Повторите новый пароль<span> *</span></label>
                            <div>
                                <input type="password" placeholder="******" {...register("repeatPassword")}
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
            </form>
        </div>
    )
}