import {AlarmMsg} from "../../../components/AlarmMsg/AlarmMsg.jsx";
import Button from "../../../components/Buttons/Button.jsx";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectMessageState} from "../../../selectors/message-selector.js";
import {resetMessageStateAction} from "../../../actions/message-actions.js";

export function AddNewOrgModal({form, isAddingOrg, onAddNewOrg, setIsAddingOrg}) {
    const dispatch = useDispatch()
    const {message, logo} = useSelector(selectMessageState)
    const onCancel = () => {
        setIsAddingOrg(!isAddingOrg)
        dispatch(resetMessageStateAction)
    }

    return (
        <div className={`add-modal-overlay ${isAddingOrg ? "" : "add-modal-overlay_hidden"}`}>
            <form onSubmit={form.handleSubmit(onAddNewOrg)} className="add-container">
                <div className="add-modal__title">
                    <h3>Новая организация</h3>
                </div>
                <AlarmMsg logo={logo}>{message}</AlarmMsg>
                <div className="add-modal__table">
                    <table className="change-container__table naked-input data-input">
                        <tbody>
                        <tr>
                            <td>Название<span> *</span></td>
                            <td className="text-center">
                                <input type="text" {...form.register("name")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Описание</td>
                            <td>
                                <textarea {...form.register("description")}></textarea>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="delete-modal__buttons">
                        <Button type="button" onClick={onCancel}>Отмена</Button>
                        <Button type="submit">Добавить</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}