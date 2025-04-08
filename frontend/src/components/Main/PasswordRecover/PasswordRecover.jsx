import React, {useState} from "react";
import styles from "./PasswordRecover.module.css"
import apiClient from "../../utils/apiClient.jsx";
import {useForm} from "react-hook-form";

export default function PasswordRecover() {
    const [alarm, setAlarm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
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
            setIsLoading(true)
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
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading ? (
                <div className={styles.loader}></div>
            ) : (
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
                                            onFocus={() => setAlarm("")}
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
                )}
        </>

    )
}