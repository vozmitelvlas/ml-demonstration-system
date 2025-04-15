import {AlarmMsg} from "../../AlarmMsg/AlarmMsg.jsx";
import {Controller} from "react-hook-form";
import Select from "react-select";
import Button from "../../Buttons/Button.jsx";
import React, {useEffect, useState} from "react";
import {customStyle, firstStyle, secondStyle} from "../../../utils/selectStyles.jsx";
import {useDispatch, useSelector} from "react-redux";
import {resetMessageStateAction} from "../../../../actions/message-actions.js";
import {selectMessageState} from "../../../../selectors/message-selector.js";
import {selectFormatModels} from "../../../../selectors/model-selectors.js";
import {getFormatModelsAction} from "../../../../actions/admin-model-actions.js";
import {selectUserRoles} from "../../../../selectors/user-selector.js";

export function AddNewModelVersionModal({isAddingVersion, setIsAddingVersion, onAdd, form, isConfirmed}) {
    const dispatch = useDispatch()
    const {message, logo} = useSelector(selectMessageState)
    const formatModels = useSelector(selectFormatModels)
    const {isAdmin} = useSelector(selectUserRoles)

    useEffect(() => {
        if (isConfirmed && isAdmin)
            dispatch(getFormatModelsAction)
    }, [isConfirmed, isAdmin, isAddingVersion])

    const [style, setStyle] = useState(customStyle)
    const setFirstMultiBackColor = () => setStyle(prevState => firstStyle(prevState))

    const setSecondMultiBackColor = () => setStyle(prevState => secondStyle(prevState))

    const onCancel = () => {
        setIsAddingVersion(false)
        dispatch(resetMessageStateAction)
    }
    return (
        <div className={`add-modal-overlay ${isAddingVersion ? "" : "add-modal-overlay_hidden"}`}>
            <form onSubmit={form.handleSubmit(onAdd)} className="add-container">
                <div className="add-modal__title">
                    <h3>Новая версия модели</h3>
                </div>
                <AlarmMsg logo={logo}>{message}</AlarmMsg>
                <div className="add-modal__table">
                    <table className="change-container__table naked-input data-input">
                        <tbody>
                        <tr onMouseEnter={setFirstMultiBackColor} onMouseLeave={setSecondMultiBackColor}>
                            <td>Модель<span> *</span></td>
                            <td>
                                <Controller
                                    control={form.control}
                                    name="selectModel"
                                    render={({
                                                 field: {onChange, value},
                                             }) => (
                                        <Select
                                            className="limits-select naked-input"
                                            options={formatModels}
                                            onChange={onChange}
                                            placeholder="Модель"
                                            value={value}
                                            isSearchable
                                            styles={style}
                                            required
                                        />
                                    )}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Название версии<span> *</span></td>
                            <td className="text-center">
                                <input type="text" {...form.register("versionName")} required/>
                            </td>
                        </tr>
                        <tr>
                            <td>URI<span> *</span></td>
                            <td className="text-center">
                                <input type="text" {...form.register("uri")} required/>
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
                </div>
                <div className="delete-modal__buttons">
                    <Button type="button" onClick={onCancel}>Отмена</Button>
                    <Button type="submit">Добавить</Button>
                </div>
            </form>
        </div>
    )
}