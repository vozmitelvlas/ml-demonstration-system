import styles from "./PesonalCabinet.module.css";
import Button from "../Button/Button.jsx";
import React from "react";

export default function EditUserData({isEditing, handleSubmit, submitFunction, register, onCancel}){
    return (
        <>
            <div className={`edit-modal-overlay ${isEditing ? "" : "edit-modal-overlay_hidden"}`}>
                <form onSubmit={handleSubmit(submitFunction)} className={styles.container}>
                    <h3>Редактирование данных</h3>
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
                            <td>Фамилия</td>
                            <td className="text-center">
                                <input type="text" {...register("lastName")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Имя</td>
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