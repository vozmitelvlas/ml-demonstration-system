import React, {useState} from "react";
import styles from "./SignIn.module.css"
import apiClient from "../../utils/apiClient.jsx";

export default function PasswordRecover() {
    const [email, setEmail] = useState("")

    const sendOnEmail = async (event) => {
        event.preventDefault()
        console.log(email)
        try{
            await apiClient(`/api/auth/password-reset`, 'POST', {email: email})
        } catch (error){
            console.log(error)
        }
    }

    const oninputChange = ({target}) => {
        setEmail(target.value)
    }

    return (
        <div className={styles.signInUp}>
            <form className={styles.container} onSubmit={sendOnEmail}>
                <div className={`${styles.inData} naked-input`}>
                    <h2>Восстановление пароля</h2>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <label>Введите почту</label>
                            <div>
                                <input type="email" placeholder="example@mail.ru" name="email" value={email}
                                       onChange={oninputChange} required/>
                            </div>
                        </div>
                    </div>
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