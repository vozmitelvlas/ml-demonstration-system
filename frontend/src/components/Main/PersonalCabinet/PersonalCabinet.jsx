import React, {useState} from 'react';
import styles from "./PesonalCabinet.module.css"
import Button from "../Button/Button.jsx";
import user_logo from "../../../assets/user2.svg";
import Input from "../Input/Input.jsx";


export default function PersonalCabinet() {
    const [isEditing, setIsEditing] = useState(false);
    let closeEditModal = (event) => {
        setIsEditing(false)
    }

    const openEditModal = () => {
        setIsEditing(true);
    };

    return (
        <div className={styles.personalCabinet}>
            <div className={styles.userOptions}>
                <a className="a-img"><img className={styles.logo} src={user_logo} alt="Пользовательский логотип"></img></a>
                <Button onClick={openEditModal}>Редактировать профиль</Button>
                <Button>Сменить пароль</Button>
                <Button>Удалить профиль</Button>
            </div>

            <div>
                <table className={styles.table}>
                    <tbody>
                    <tr>
                        <td>Логин</td>
                        <td>ivanov_ivan</td>
                    </tr>
                    <tr>
                        <td>Фамилия</td>
                        <td>Ivanov</td>
                    </tr>
                    <tr>
                        <td>Имя</td>
                        <td>Ivan</td>
                    </tr>
                    <tr>
                        <td>Отчество</td>
                        <td>Jovanovich</td>
                    </tr>
                    <tr>
                        <td>E-mail</td>
                        <td>ivan@mail.ru</td>
                    </tr>

                    <tr>
                        <td>Описание</td>
                        <td><textarea id={"description"} rows="14" cols="60" defaultValue={"ADASAlasdair"} disabled></textarea></td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className={`edit-modal-overlay ${isEditing ? "" : "edit-modal-overlay_hidden"}`}>
                <div className="edit-modal">
                    <div className="edit-modal__title">
                        <h3>Редактирование данных</h3>
                    </div>
                    <table className="change-container__table tableHover naked-input">
                        <tbody>
                        <tr>
                            <td>Логин</td>
                            <td className="text-center"><Input>ivanov_ivan</Input></td>
                        </tr>
                        <tr>
                            <td>Фамилия</td>
                            <td className="text-center"><Input>Ivanov</Input></td>
                        </tr>
                        <tr>
                            <td>Имя</td>
                            <td className="text-center"><Input>Ivan</Input></td>
                        </tr>
                        <tr>
                            <td>Отчество</td>
                            <td className="text-center"><Input>Jovanovich</Input></td>
                        </tr>
                        <tr>
                            <td>E-mail</td>
                            <td className="text-center"><Input>ivan@mail.ru</Input></td>
                        </tr>

                        <tr>
                            <td>Описание</td>
                            <td className="text-center"><textarea id={"description"} rows="12" cols="50" defaultValue={"ADASAlasdair"}></textarea></td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="edit-modal__buttons">
                        <Button onClick={closeEditModal}>Отмена</Button>
                        <Button>Сохранить</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};