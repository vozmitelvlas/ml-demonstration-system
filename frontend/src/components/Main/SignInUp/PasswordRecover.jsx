import Input from "../../Input.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";

function PasswordRecover() {
    let navigate = useNavigate()
    const handleEnterClick = () => {
        navigate("/models")
    }

    return (
        <div className="sign-in-up">
            <div className="sign-in-up__container">
                <p className="text-class">Регистрация</p>
                <Input type="password" placeholder="Введите email"></Input>
                <button className="sign-in-up__button" onClick={handleEnterClick}>Восстановить</button>
            </div>

        </div>
    )
}

export default PasswordRecover