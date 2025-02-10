import Filter from "../Filter/Filter.jsx";
import React, {useState} from "react";
import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../Button/Button.jsx";
import editLogo from "../../../assets/edit.svg";
import deleteLogo from "../../../assets/delete.svg";
import {Link, useNavigate} from "react-router-dom";
import styles from"./MyOrganisations.module.css"
import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";

const limitOptions = [
    {value: 'O1', label: 'Лимит организации'},
    {value: 'O2', label: 'Лимиты модели'},
    {value: 'O2', label: 'Лимиты пользователя'}
];

export default function MyOrganisations(){
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    let onEditOrg = () => {
        navigate("/user/organisations/edit")
    }

    const allUsers = [{
        id: 3,
        email: "123123.mail.ru"
    }, {id: 4, email: "adaqwdawdawd.mail.ru"}, {id: 1, email: "vvvvv.mail.ru"}, {id: 2, email: "qqqqq.mail.ru"}, {id: 3, email: "123123.mail.ru"}, {id: 4, email: "adaqwdawdawd.mail.ru"},
        {id: 1, email: "vvvvv.mail.ru"}, {id: 2, email: "qqqqq.mail.ru"}, {
            id: 3,
            email: "123123.mail.ru"
        }, {id: 4, email: "adaqwdawdawd.mail.ru"}, {id: 1, email: "vvvvv.mail.ru"}, {id: 2, email: "qqqqq.mail.ru"}, {id: 3, email: "123123.mail.ru"}, {id: 4, email: "adaqwdawdawd.mail.ru"}]

    return (
        <>
            {isOpen &&
                <Filter
                    setIsOpen={setIsOpen}
                    sorts={{
                        "Сортировать": {
                            options: ["Последние добавленные", "Давно добавленные"],
                            names: ["latestAdded", "oldestAdded"]
                        },
                    }}></Filter>
            }

            <main>
                <div className={styles.header}>
                    <h1>Моя организация</h1>
                </div>

                <div className={styles.content}>
                    <div className={styles.limit}>
                        <h2>Название организации - <span>Название</span></h2>

                        <div>
                            <h2>Описание:</h2>
                            <textarea defaultValue={"ADASAlasdair"} disabled></textarea>
                        </div>

                        <div>
                            <h2>Установка лимита для участников организации:</h2>
                            <div className={styles.limits}>
                                <Select
                                    className={"limits-select"}
                                    options={limitOptions}
                                    // onChange={handleSelectChange}
                                    closeMenuOnSelect={false}
                                    placeholder={"Пользователи"}
                                    isSearchable
                                    styles={customStyle}
                                />
                                <button className={styles.button}>Сохранить</button>
                            </div>
                        </div>


                    </div>

                    <div  className={styles.users}>
                        <h2>Участники организации:</h2>
                        <div className={styles.table}>
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
                    </div>

                </div>

            </main>
        </>
    )
}