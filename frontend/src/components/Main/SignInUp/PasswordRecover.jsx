
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./SignIn.module.css"

export default function PasswordRecover() {
    let navigate = useNavigate()
    const [email, setEmail] = useState("")

    const sendFormData = (event) => {
        event.preventDefault()
        navigate("/models")
    }
    const onEmailChange = ({target}) => {
        setEmail(target.value)
    }

    return (
        <div className={styles.signInUp}>
            <div className={styles.container}>
                <form onSubmit={sendFormData}>
                    <p className="text-class">Восстановление пароля</p>
                    <input value={email} type="email" placeholder="Введите email" onChange={onEmailChange}/>
                    <button className={styles.button}>Восстановить</button>
                </form>
            </div>
        </div>
    )
}