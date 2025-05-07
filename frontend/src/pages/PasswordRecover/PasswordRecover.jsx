import React, {useState} from "react";
import styles from "./PasswordRecover.module.css"
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {selectMessageState} from "../../selectors/message-selector.js";
import {resetMessageStateAction, setAcceptMessageAction} from "../../actions/message-actions.js";
import {sendPasswordTokenOnEmailAction} from "../../actions/auth-actions.js";

export default function PasswordRecover() {
    const dispatch = useDispatch()
    const {message} = useSelector(selectMessageState)
    const [isLoading, setIsLoading] = useState(false)
    const passwordForm = useForm({
        defaultValues: {
            email: ""
        }
    })

    const firstErrorKey = Object.keys(passwordForm.formState.errors)[0];
    const error = firstErrorKey ? passwordForm.formState.errors[firstErrorKey].message : ''

    const sendOnEmail = async (formData) => {
        setIsLoading(true)

        dispatch(sendPasswordTokenOnEmailAction(formData)).then(() => {
            passwordForm.reset()
            dispatch(setAcceptMessageAction("Письмо успешно отправлено"))
        }).catch((error) => {
            if (error.status === 404)
                passwordForm.setError('form', {type: 'email', message: error.detail})
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
                    <form onSubmit={passwordForm.handleSubmit(sendOnEmail)} className={styles.container}>
                        <div className={`${styles.inData} naked-input`}>
                            <h2>Восстановление пароля</h2>
                            <div className={styles.row}>
                                <div className={styles.inputDiv}>
                                    <label>Введите почту</label>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="example@mail.ru"
                                            {...passwordForm.register("email")}
                                            onFocus={() => dispatch(resetMessageStateAction)}
                                            required/>
                                    </div>
                                </div>
                            </div>
                            {error && <span>{error}</span>}
                            {message && <span className={styles.emailAlarm}>{message}</span>}
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