import "./SignIn.css"
import Input from "../../Input.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";

function SignIn(){
    let navigate = useNavigate()
    const handleEnterClick = () => {
        navigate("/models")
    }


    return(
        <div className="sign-in-up">

            <div className="sign-in-up__container">
                <p className="text-class">Вход</p>
                <Input placeholder="Логин"></Input>
                <Input placeholder="Пароль"></Input>
                <button className="sign-in-up__button" onClick={handleEnterClick}>Войти</button>
                <span id="password" onClick={() => navigate("/password")}>Забыли пароль?</span>
                <p>Нет аккаунта? <span id="password" onClick={() => navigate("/signup")}>Зарегистрируйтесь</span></p>
            </div>

        </div>
    )
}
export default SignIn