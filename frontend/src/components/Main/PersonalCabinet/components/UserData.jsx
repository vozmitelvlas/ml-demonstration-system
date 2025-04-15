import styles from "../PesonalCabinet.module.css";
import {AlarmMsg} from "../../AlarmMsg/AlarmMsg.jsx";
import React from "react";
import {useSelector} from "react-redux";
import {selectUserData} from "../../../../selectors/user-selector.js";
import {selectMessageState} from "../../../../selectors/message-selector.js";

export function UserData() {
    const userData = useSelector(selectUserData)
    const {message, logo} = useSelector(selectMessageState)

    return (
        <div className={styles.userData}>
            <AlarmMsg logo={logo}>{message}</AlarmMsg>
            <table className={styles.table}>
                <tbody>
                <tr>
                    <td>Логин</td>
                    <td>{userData.login}</td>
                </tr>
                <tr>
                    <td>Фамилия</td>
                    <td>{userData.lastName}</td>
                </tr>
                <tr>
                    <td>Имя</td>
                    <td>{userData.firstName}</td>
                </tr>
                <tr>
                    <td>Отчество</td>
                    <td>{userData.patronymic}</td>
                </tr>
                <tr>
                    <td>E-mail</td>
                    <td>{userData.email}</td>
                </tr>

                <tr>
                    <td>Описание</td>
                    <td>
                            <textarea
                                id={styles.description}
                                value={userData.description ? userData.description : ""}
                                disabled
                            />
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}