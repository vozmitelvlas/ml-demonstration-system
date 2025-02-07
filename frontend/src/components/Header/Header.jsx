import {getDateFormat, getTimeFormat} from "../utils/DateAndTime.jsx";
import userLogo from "../../assets/user.svg";
import {useNavigate} from "react-router-dom";
import exit from "../../assets/exit.svg";
import menu from "../../assets/menu.svg";
import styles from "./Header.module.css";

export default function Header({login, isAdminMode, setIsAdminMode, isAdmin, isMainOrg}) {
    let navigate = useNavigate();

    const toggleAdminMode = () => {
        setIsAdminMode(!isAdminMode)
        navigate('/models')

        let adminButton = document.querySelector('[name="admin-button"]')
        if (!isAdminMode) {
            adminButton.textContent = "Режим пользователя"
        } else {
            adminButton.textContent = "Режим администратора"
        }
    };

    return (
        <header>
            <div className={styles.left} onClick={() => navigate("/user")}>
                <a className="a-img"><img src={userLogo} alt={"lk"}></img></a>
                <h3>{login}</h3>
            </div>

            <div className={styles.right}>
                <b>{getDateFormat(new Date())} &nbsp; {getTimeFormat(new Date())}</b>
                <div className={styles.dropdown}>
                    <a className="a-img"><img src={menu} alt={"menu"}></img></a>
                    <div className={styles.content}>
                        <a onClick={() => {
                            navigate("/user")
                        }}>Личный кабинет</a>
                        <a onClick={() => {
                            navigate("/models")
                        }}>Каталог моделей</a>
                        {isMainOrg && (
                            <a onClick={() => {navigate("/user/organisations")}}>Мои организации</a>
                        )}
                        {isAdmin && (
                            <a name="admin-button" onClick={toggleAdminMode}>Режим администратора</a>
                        )}
                    </div>
                </div>
                <a className="a-img" onClick={() => navigate("/")}><img src={exit} alt={"exit"}></img></a>
            </div>

        </header>
    )
}