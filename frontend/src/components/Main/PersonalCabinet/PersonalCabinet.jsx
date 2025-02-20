import React, {useEffect, useState} from 'react';
import styles from "./PesonalCabinet.module.css"
import Button from "../Button/Button.jsx";
import user_logo from "../../../assets/user2.svg";


export default function PersonalCabinet({userData}) {
    const [isEditing, setIsEditing] = useState(false);

    let closeEditModal = () => {
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
                        <td>{userData?.login}</td>
                    </tr>
                    <tr>
                        <td>Фамилия</td>
                        <td>{userData?.lastName}</td>
                    </tr>
                    <tr>
                        <td>Имя</td>
                        <td>{userData?.firstName}</td>
                    </tr>
                    <tr>
                        <td>Отчество</td>
                        <td>{userData?.patronymic}</td>
                    </tr>
                    <tr>
                        <td>E-mail</td>
                        <td>{userData?.email}</td>
                    </tr>

                    <tr>
                        <td>Описание</td>
                        <td><textarea disabled defaultValue={userData?.description}></textarea></td>
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
                            <td className="text-center"><input type="text" defaultValue={"vlas_vozmitel"} disabled={true}/></td>
                        </tr>
                        <tr>
                            <td>E-mail</td>
                            <td className="text-center"><input type="text" defaultValue={"vlas_vozmitel@mail.ru "} disabled={true}/></td>
                        </tr>
                        <tr>
                            <td>Фамилия</td>
                            <td className="text-center"><input type="text" defaultValue={""}/></td>
                        </tr>
                        <tr>
                            <td>Имя</td>
                            <td className="text-center"><input type="text" defaultValue={""}/></td>
                        </tr>
                        <tr>
                            <td>Отчество</td>
                            <td className="text-center"><input type="text" defaultValue={""}/></td>
                        </tr>


                        <tr>
                            <td>Описание</td>
                            <td className="text-center"><textarea defaultValue={"ADASAlasdair"}></textarea></td>
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