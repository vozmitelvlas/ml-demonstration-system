import {getDateFormat, getTimeFormat} from "../../utils/DateAndTime.jsx";
import user_logo from "../../assets/user.svg";
import exit from "../../assets/exit.svg";
import menu from "../../assets/menu.svg"
import "./Header.css"
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

function Header({login, isAdminMode, setIsAdminMode, isAdmin}) {
    let navigate = useNavigate();

    const toggleAdminMode = () => {
        setIsAdminMode(!isAdminMode)
        navigate('/models')

        let adminButton = document.querySelector('[name="admin-button"]')
        if(!isAdminMode){
            adminButton.textContent = "Режим пользователя"
        } else {
            adminButton.textContent = "Режим администратора"
        }
    };

    return (
        <header>
            <div className="left-header" onClick={() => navigate("/user")}>
                <a><img src={user_logo}></img></a>
                <h3>{login}</h3>
            </div>

            <div className="right_header">
                <b>{getDateFormat(new Date())} &nbsp; {getTimeFormat(new Date())}</b>
                <div className="dropdown">
                    <a className="a-img"><img src={menu}></img></a>
                    <div className="dropdown-content">
                        <a onClick={() => {
                            navigate("/user")
                        }}>Личный кабинет</a>
                        <a onClick={() => {
                            navigate("/models")
                        }}>Каталог моделей</a>
                        {isAdmin && (
                            <a name="admin-button" onClick={toggleAdminMode}>Режим администратора</a>
                        )}
                    </div>
                </div>
                <a id="exitLogo" className="a-img" onClick={() => navigate("/")}><img src={exit}></img></a>
            </div>

        </header>
    )
}

export default Header