import styles from "./SignIn.module.css"
import Input from "../Input/Input.jsx";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function SignIn() {
    let navigate = useNavigate()
    const handleEnterClick = () => {
        navigate("/models")
    }

    // useEffect(() => {
    //     const loginData = {
    //         username: 'admin',
    //         password: 'password'
    //     };
    //
    //     axios
    //         .post('http://localhost:8080/api/auth/login', loginData)
    //         .then((res) => {
    //             console.log(res);
    //         });
    // }, []);

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