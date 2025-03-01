import styles from "./PesonalCabinet.module.css";
import Button from "../Button/Button.jsx";
import React from "react";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";

export default function EditUserData({isEditing, handleSubmit, submitFunction, register, onCancel, logo, alarm}){
    return (
        <>
            <div className={`edit-modal-overlay ${isEditing ? "" : "edit-modal-overlay_hidden"}`}>
                <form onSubmit={handleSubmit(submitFunction)} className={styles.container}>
                    <h3>Редактирование данных</h3>
                    <AlarmMsg logo={logo}>{alarm}</AlarmMsg>
                    <table className="change-container__table naked-input">
                        <tbody>
                        <tr>
                            <td>Логин</td>
                            <td className="text-center">
                                <input type="text" {...register("login")} disabled/>
                            </td>
                        </tr>
                        <tr>
                            <td>E-mail</td>
                            <td className="text-center">
                                <input type="text" {...register("email")} disabled/>
                            </td>
                        </tr>
                        <tr>
                            <td>Фамилия<span> *</span></td>
                            <td className="text-center">
                                <input type="text" {...register("lastName")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Имя<span> *</span></td>
                            <td className="text-center">
                                <input type="text" {...register("firstName")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Отчество</td>
                            <td className="text-center">
                                <input type="text" {...register("patronymic")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Описание</td>
                            <td className="text-center">
                                <textarea {...register("description")}></textarea>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="edit-modal__buttons">
                        <Button type="button" onClick={onCancel}>Отмена</Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </form>
            </div>
        </>
    )
}