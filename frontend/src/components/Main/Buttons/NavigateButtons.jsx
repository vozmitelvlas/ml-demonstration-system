import Button from "./Button.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";

export function NavigateButtons({isAdminMode, setIsOpen}){
    const navigate = useNavigate()
    return(
        <>
            <div className="options-buttons">
                <Button classNames="filter-button" onClick={() => {
                    setIsOpen(prev => !prev)
                }}>Фильтр</Button>
                {isAdminMode && (
                    <div className="options-buttons_right-down">
                        <Button onClick={() => {
                            navigate("/models")
                        }}>Модели</Button>
                        <Button onClick={() => {
                            navigate("/users")
                        }}>Пользователи</Button>
                        <Button onClick={() => {
                            navigate("/organisations")
                        }}>Организации</Button>
                    </div>
                )}
            </div>
        </>
    )
}