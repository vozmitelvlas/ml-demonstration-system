import DataHeader from "../Headers/DataHeader.jsx";
import React from "react";
import Input from "../../Input.jsx";
import Button from "../../Button.jsx";
import {useNavigate} from "react-router-dom";


function ChangeUserData(){
    let navigate = useNavigate()
    $(document).ready(function() {
        $(".js-select2").select2({
            closeOnSelect : false,
            placeholder : "Администраторы",
            // allowHtml: true,
            allowClear: true,
            tags: true // создает новые опции на лету
        });
    });


    return(
        <div className="change-container">
            <div>
                <DataHeader firstButton="ИНФОРМАЦИЯ" secondButton="МОДЕЛИ">Изменение данных пользователя</DataHeader>
                <div className="change-container__info">
                    <table className="change-container__table">
                        <tbody className="naked-input">
                        <tr>
                            <td>Логин</td>
                            <td><Input classNames={"text-center"}>ivanov_ivan</Input></td>
                        </tr>
                        <tr>
                            <td>Фамилия</td>
                            <td><Input>Ivanov</Input></td>
                        </tr>
                        <tr>
                            <td>Имя</td>
                            <td><Input>Ivan</Input></td>
                        </tr>
                        <tr>
                            <td>Организация</td>
                            <td>
                                <select>
                                    <option value="default">{"Администраторы"}</option>
                                    <option value="users">Пользователи</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Дата регистрации</td>
                            <td><Input>17.09.2025</Input></td>
                        </tr>
                        <tr>
                            <td>Описание</td>
                            <td><textarea id={"description"} rows="12" cols="50" defaultValue={"Asdasd"}></textarea></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="change-container__second tableHover" hidden>
                    <h2>Доступные пользователю модели</h2>
                    <table className="change-container__table">
                        <thead>
                        <tr>
                            <th className="text-center">
                                <strong>ID</strong>
                            </th>
                            <th className="text-center">
                                <strong>Название</strong>
                            </th>
                            <th className="text-center">
                                <strong>Лимит RPS</strong>
                            </th>
                            <th className="text-center">
                                <strong>Лимит запросов/нед</strong>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="naked-input">
                        <tr>
                            <td className="text-center">1</td>
                            <td className="text-center">Graph-based segmentation model</td>
                            <td className="text-center">50</td>
                            <td className="text-center">1000</td>
                        </tr>
                        <tr>
                            <td className="text-center">2</td>
                            <td className="text-center">Graph-based segmentation model</td>
                            <td className="text-center">10</td>
                            <td className="text-center">-</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="delete-modal__buttons">
                <Button onClick={() => {navigate("/users")}}>Назад</Button>
                <Button>Сохранить</Button>
            </div>
        </div>

    )

}
export default ChangeUserData