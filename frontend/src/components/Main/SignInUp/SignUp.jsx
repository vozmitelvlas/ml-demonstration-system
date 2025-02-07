import Input from "../Input/Input.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";
import styles from "./SignIn.module.css"

export default function SignUp(){
    let navigate = useNavigate()

    return(
        <div className={styles.signInUp}>
            <div className={styles.container}>
                <p className="text-class">Регистрация</p>
                <Input placeholder="Логин"></Input>
                <Input placeholder="Фамилия"></Input>
                <Input placeholder="Имя"></Input>
                <Input placeholder="Отчество"></Input>
                <Input placeholder="E-mail"></Input>
                <Input type="password" placeholder="Пароль"></Input>
                <Input type="password" placeholder="Повторите пароль"></Input>
                <button className={styles.button} onClick={() => navigate("/models")}>Зарегистрироваться</button>
                <p>Если есть аккант, <span className={styles.password} onClick={() => navigate("/")}>войдите</span></p>
            </div>
        </div>
    )
}