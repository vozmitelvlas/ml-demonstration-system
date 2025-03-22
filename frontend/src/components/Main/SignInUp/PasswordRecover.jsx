import React, {useState} from "react";
import styles from "./SignIn.module.css"
import apiClient from "../../utils/apiClient.jsx";
import {useForm} from "react-hook-form";

export default function PasswordRecover() {
    const [email, setEmail] = useState("")
    const [alarm, setAlarm] = useState("")
    const {
        handleSubmit,
        register,
        setError,
        formState: {errors},
        reset,
    } = useForm({
        defaultValues: {
            email: ""
        }
    })

    const firstErrorKey = Object.keys(errors)[0];
    const error = firstErrorKey ? errors[firstErrorKey].message : ''

    const sendOnEmail = async (formData) => {
        try {
            await apiClient(`/api/auth/password-reset`, 'POST', formData)

            reset()
            setAlarm("Письмо успешно отправлено")
        } catch (error) {
            if (error.status === 404)
                setError('form', {
                    type: 'email',
                    message: error.detail
                })
            else
                console.log(error)
        }
    }
    const onInputFocus = () => {
        console.log("asd")
        setAlarm("")
    }

    return (
        <div className={styles.signInUp}>
            <form onSubmit={handleSubmit(sendOnEmail)} className={styles.container}>
                <div className={`${styles.inData} naked-input`}>
                    <h2>Восстановление пароля</h2>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <label>Введите почту</label>
                            <div>
                                <input
                                    type="email"
                                    placeholder="example@mail.ru"
                                    {...register("email")}
                                    onFocus={onInputFocus}
                                    required/>
                            </div>
                        </div>
                    </div>
                    {error && <span>{error}</span>}
                    {alarm && <span className={styles.emailAlarm}>{alarm}</span>}
                    <div className={styles.row}>
                        <div className={styles.button}>
                            <div>
                                <button type="submit">Отправить письмо</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}