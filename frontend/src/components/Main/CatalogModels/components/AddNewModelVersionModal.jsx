import {AlarmMsg} from "../../AlarmMsg/AlarmMsg.jsx";
import {Controller} from "react-hook-form";
import Select from "react-select";
import Button from "../../Buttons/Button.jsx";
import React, {useState} from "react";
import {customStyle, firstStyle, secondStyle} from "../../../utils/selectStyles.jsx";

export function AddNewModelVersionModal({isAddingVersion, logo, alarm, onCancel, onAdd, form, allModels}){
    const [style, setStyle] = useState(customStyle)
    const setFirstMultiBackColor = () => {
        setStyle(prevState => firstStyle(prevState))
    }

    const setSecondMultiBackColor = () => {
        setStyle(prevState => secondStyle(prevState))
    }

    return(
        <>
            <div className={`add-modal-overlay ${isAddingVersion ? "" : "add-modal-overlay_hidden"}`}>
                <form onSubmit={form.handleSubmit(onAdd)} className="add-container">
                    <div className="add-modal__title">
                        <h3>Новая версия модели</h3>
                    </div>
                    <AlarmMsg logo={logo}>{alarm}</AlarmMsg>
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
                                                options={allModels}
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
        </>
    )
}