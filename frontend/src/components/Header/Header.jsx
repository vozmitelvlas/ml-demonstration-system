import {getDateFormat, getTimeFormat} from "../utils/DateAndTime.jsx";
import userLogo from "../../assets/user.svg";
import {useNavigate} from "react-router-dom";
import exit from "../../assets/exit.svg";
import menu from "../../assets/menu.svg";
import styles from "./Header.module.css";
import icon from "../../assets/icon.svg"
import apiClient from "../utils/apiClient.jsx";
import {useEffect, useState} from "react";

export default function Header({login, isAdminMode, setIsAdminMode, isAdmin, isMainOrg, orgId}) {
    const navigate = useNavigate()
    const [tmpTime, setTmpTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            const tmpMinute = new Date().getMinutes()

            if(tmpMinute !== tmpTime.getMinutes())
                setTmpTime(new Date())
        }, 1000)

        return () => clearInterval(timer);
    }, []);

    const toggleAdminMode = () => {
        setIsAdminMode(!isAdminMode)
        sessionStorage.setItem("isAdminMode", !isAdminMode)
        console.log(sessionStorage.getItem("isAdminMode"))
        navigate('/models')
    }

    const onExitClick = async () => {
        try {
            sessionStorage.clear()
            setIsAdminMode(false)

            await apiClient(`/api/auth/logout`)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <header className={isAdminMode ? styles.adminMode : styles.header}>
            {!isAdminMode && (
                <div className={styles.left} onClick={() => navigate("/models")}>
                    <a className="a-img"><img src={icon} alt={"km"}></img></a>
                    <h3>ML MODELS</h3>
                </div>
            )}

            {isAdminMode && (
                <div className={styles.left} onClick={() => navigate("/profile")}>
                    <a className="a-img"><img src={userLogo} alt={"lk"}
                                              className={isAdminMode ? styles.whiteSvg : ""}></img></a>
                    <h3>{login}</h3>
                </div>
            )}

            {isAdminMode && (<h3 style={{marginLeft: "20px", opacity: 0.65}}>Режим Администратора</h3>)}

            <div className={styles.right}>
                <b>{getDateFormat(tmpTime)} &nbsp; {getTimeFormat(tmpTime)}</b>
                <div className={styles.dropdown}>
                    <a className="a-img"><img src={menu} alt={"menu"}
                                              className={isAdminMode ? styles.whiteSvg : ""}></img></a>
                    <div className={styles.content}>
                        <a onClick={() => {
                            navigate("/profile")
                        }}>Личный кабинет</a>
                        <a onClick={() => {
                            navigate("/models")
                        }}>Каталог моделей</a>
                        {isMainOrg && (
                            <a onClick={() => {
                                navigate(`/organisation/${orgId}`)
                            }}>Моя организация</a>
                        )}
                        {isAdmin && (
                            <a name="admin-button" onClick={toggleAdminMode}>{isAdminMode ? "Режим пользователя" : "Режим администратора"}</a>
                        )}
                        {isAdminMode && (
                            <a>Мониторинг</a>
                        )}
                    </div>
                </div>
                <a className="a-img" onClick={onExitClick}><img src={exit} alt={"exit"}
                                                                className={isAdminMode ? styles.whiteSvg : ""}></img></a>
            </div>

        </header>
    )
}