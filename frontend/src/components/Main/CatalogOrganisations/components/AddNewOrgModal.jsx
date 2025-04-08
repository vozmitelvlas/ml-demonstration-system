import {AlarmMsg} from "../../AlarmMsg/AlarmMsg.jsx";
import Button from "../../Buttons/Button.jsx";
import React from "react";

export function AddNewOrgModal({
                                   handleSubmit,
                                   register,
                                   isAddingOrg,
                                   onAddNewOrg,
                                   setAlarm,
                                   alarm,
                                   logo,
                                   setIsAddingOrg
                               }) {
    return (
        <>
            <div className={`add-modal-overlay ${isAddingOrg ? "" : "add-modal-overlay_hidden"}`}>
                <form onSubmit={handleSubmit(onAddNewOrg)} className="add-container">
                    <div className="add-modal__title">
                        <h3>Новая организация</h3>
                    </div>
                    <AlarmMsg logo={logo}>{alarm}</AlarmMsg>
                    <div className="add-modal__table">
                        <table className="change-container__table naked-input data-input">
                            <tbody>
                            <tr>
                                <td>Название<span> *</span></td>
                                <td className="text-center">
                                    <input type="text" {...register("name")}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Описание</td>
                                <td>
                                    <textarea {...register("description")}></textarea>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="delete-modal__buttons">
                            <Button type="button" onClick={() => {
                                setIsAddingOrg(!isAddingOrg)
                                setAlarm(null)
                            }}>Отмена</Button>
                            <Button type="submit">Добавить</Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}