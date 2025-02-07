import Input from "../Input/Input.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";
import styles from "./SignIn.module.css"

export default function PasswordRecover() {
    let navigate = useNavigate()
    const handleEnterClick = () => {
        navigate("/models")
    }

    return (
        <div className={styles.signInUp}>
            <div className={styles.container}>
                <p className="text-class">Регистрация</p>
                <Input type="password" placeholder="Введите email"></Input>
                <button className={styles.button} onClick={handleEnterClick}>Восстановить</button>
            </div>
        </div>
    )
}