import styles from "./SignIn.module.css"
import Input from "../Input/Input.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function SignIn() {
    let navigate = useNavigate()
    const handleEnterClick = () => {
        navigate("/models")
    }

    return (
        <div className={styles.signInUp}>

            <div className={styles.container}>
                <p className="text-class">Вход</p>
                <Input placeholder="Логин"></Input>
                <Input placeholder="Пароль"></Input>
                <button className={styles.button} onClick={handleEnterClick}>Войти</button>
                <span className={styles.password} onClick={() => navigate("/password")}>Забыли пароль?</span>
                <p>
                    Нет аккаунта?
                    <span className={styles.password} onClick={() => navigate("/signup")}>Зарегистрируйтесь</span>
                </p>
            </div>

        </div>
    )
}