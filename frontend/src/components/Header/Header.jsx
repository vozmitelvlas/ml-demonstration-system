import {getDateFormat, getTimeFormat} from "../utils/DateAndTime.jsx";
import userLogo from "../../assets/user.svg";
import {useNavigate} from "react-router-dom";
import exit from "../../assets/exit.svg";
import menu from "../../assets/menu.svg";
import styles from "./Header.module.css";
import {useDispatch} from "react-redux";
import {setUserInfo} from "../store/user-slice.jsx";

export default function Header({login, isAdminMode, setIsAdminMode, isAdmin, isMainOrg}) {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const toggleAdminMode = (event) => {
        setIsAdminMode(!isAdminMode)
        navigate('/models')

        let adminButton = event.target
        if (!isAdminMode) {
            adminButton.textContent = "Режим пользователя"
        } else {
            adminButton.textContent = "Режим администратора"
        }
    };
    const onExitClick = () => {
        // dispatch(setUserInfo({}))
        setIsAdminMode(false)
        navigate("/")
    }

    return (
        <header className={isAdminMode ? styles.adminMode : styles.header}>
            <div className={styles.left} onClick={() => navigate("/user")}>
                <a className="a-img"><img src={userLogo} alt={"lk"} className={isAdminMode ? styles.whiteSvg : ""}></img></a>
                <h3>{login}</h3>
            </div>
            {isAdminMode && (<h3 style={{marginLeft: "20px", opacity: 0.5}}>Режим Администратора</h3>)}

            <div className={styles.right}>
                <b>{getDateFormat(new Date())} &nbsp; {getTimeFormat(new Date())}</b>
                <div className={styles.dropdown}>
                    <a className="a-img"><img src={menu} alt={"menu"} className={isAdminMode ? styles.whiteSvg : ""}></img></a>
                    <div className={styles.content}>
                        <a onClick={() => {
                            navigate("/user")
                        }}>Личный кабинет</a>
                        <a onClick={() => {
                            navigate("/models")
                        }}>Каталог моделей</a>
                        {isMainOrg && (
                            <a onClick={() => {navigate("/user/organisation")}}>Моя организация</a>
                        )}
                        {isAdmin && (
                            <a name="admin-button" onClick={toggleAdminMode}>Режим администратора</a>
                        )}
                        {isAdminMode && (
                            <a>Мониторинг</a>
                        )}
                    </div>
                </div>
                <a className="a-img" onClick={onExitClick}><img src={exit} alt={"exit"} className={isAdminMode ? styles.whiteSvg : ""}></img></a>
            </div>

        </header>
    )
}