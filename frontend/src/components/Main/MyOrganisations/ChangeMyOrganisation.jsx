import DataHeader from "../Headers/DataHeader.jsx";
import React, {useState} from "react";
import styles from"./MyOrganisations.module.css"
import Button from "../Button/Button.jsx";
import {useNavigate} from "react-router-dom";

export default function ChangeMyOrganisation() {
    let navigate = useNavigate()
    const [activeBut, setActiveBut] = useState("first");
    const allUsers = [{id: 1, email: "vvvvv.mail.ru"}, {id: 2, email: "qqqqq.mail.ru"}, {
        id: 3,
        email: "123123.mail.ru"
    }, {id: 4, email: "adaqwdawdawd.mail.ru"}, {id: 1, email: "vvvvv.mail.ru"}, {id: 2, email: "qqqqq.mail.ru"}, {id: 3, email: "123123.mail.ru"}, {id: 4, email: "adaqwdawdawd.mail.ru"},
        {id: 1, email: "vvvvv.mail.ru"}, {id: 2, email: "qqqqq.mail.ru"}, {
            id: 3,
            email: "123123.mail.ru"
        }, {id: 4, email: "adaqwdawdawd.mail.ru"}, {id: 1, email: "vvvvv.mail.ru"}, {id: 2, email: "qqqqq.mail.ru"}, {id: 3, email: "123123.mail.ru"}, {id: 4, email: "adaqwdawdawd.mail.ru"}]

    return (
        <div className="change-container">
            <div>
                <DataHeader
                    activeBut={activeBut}
                    setActiveBut={setActiveBut}
                    firstButton="УЧАСТНИКИ"
                    secondButton="ЛИМИТЫ">
                    Участники и лимиты организации
                </DataHeader>

                {activeBut === "first" && (
                    <div className={styles.users}>
                        <table className="change-container__table tableHover to-center">
                            <tbody>
                            {allUsers.map((user, ind) => (
                                <tr key={ind}>
                                    <td>{ind + 1}</td>
                                    <td className="text-center">{user.email}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeBut === "second" && (
                    <div>
                        <h2>Установка лимита для участников организации</h2>
                        <select>
                            <option value="default">Лимит организации</option>
                            <option value="users">Лимиты модели </option>
                            <option value="users">Лимиты пользователя </option>
                        </select>
                    </div>
                )}
            </div>

            <div className="delete-modal__buttons">
                <Button onClick={() => {navigate("/user/organisations")}}>Назад</Button>
                <Button>Сохранить</Button>
            </div>

        </div>
    )
}