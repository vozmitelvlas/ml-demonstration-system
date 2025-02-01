import React, {useState} from 'react';
import "./PesonalCabinet.css"
import Button from "../../Button.jsx";
import user_logo from "../../../assets/user2.svg";
import Input from "../../Input.jsx";


function PersonalCabinet() {
    const [isEditing, setIsEditing] = useState(false);
    let closeModal = (event) => {
        let editModal = event.target.closest(".edit-modal-overlay")
        editModal.classList.add("edit-modal-overlay_hidden")
    }

    const handleEditClick = () => {
        setIsEditing(true);

        let editModal = document.querySelector(".edit-modal-overlay")
        editModal.classList.remove("edit-modal-overlay_hidden")

    };

    return (
        <div className="personal-cabinet">
            <div className="personal-cabinet__user-options">
                <a className="a-img"><img className="user-logo" src={user_logo} alt="Пользовательский логотип"></img></a>
                <Button classNames="user-button" onClick={handleEditClick}>Редактировать профиль</Button>
                <Button classNames="user-button">Сменить пароль</Button>
                <Button classNames="user-button">Удалить профиль</Button>
            </div>

            <div className="personal-cabinet__user-info">
                <table className="personal-cabinet__table">
                    <tbody className="naked-input">
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
                        <td id="td-description">Описание</td>
                        <td><textarea id={"description"} rows="14" cols="60" defaultValue={"ADASAlasdair"} disabled></textarea></td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="edit-modal-overlay edit-modal-overlay_hidden">
                <div className="edit-modal">
                    <div className="edit-modal__title">
                        <h3>Редактирование данных</h3>
                    </div>
                    <table className="change-container__table tableHover naked-input ">
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
                        <Button onClick={closeModal}>Отмена</Button>
                        <Button>Сохранить</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalCabinet;