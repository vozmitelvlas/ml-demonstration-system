import Input from "../../Input.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";
import "./SignIn.css"

function SignUp(){
    let navigate = useNavigate()
    const handleEnterClick = () => {
        navigate("/models")
    }

    return(
        <div className="sign-in-up">

            <div className="sign-in-up__container">
                <p className="text-class">Регистрация</p>
                <Input placeholder="Логин"></Input>
                <Input placeholder="Фамилия"></Input>
                <Input placeholder="Имя"></Input>
                <Input placeholder="Отчество"></Input>
                <Input placeholder="E-mail"></Input>
                <Input type="password" placeholder="Пароль"></Input>
                <Input type="password" placeholder="Повторите пароль"></Input>
                <button className="sign-in-up__button" onClick={handleEnterClick}>Зарегистрироваться</button>
                <p>Если есть аккант, <span id="password" onClick={() => navigate("/")}>войдите</span></p>
            </div>

        </div>
    )
}
export default SignUp