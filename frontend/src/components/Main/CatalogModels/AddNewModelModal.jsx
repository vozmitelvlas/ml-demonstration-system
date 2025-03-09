import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import Select from "react-select";
import Button from "../Button/Button.jsx";
import React, {useState} from "react";
import {customStyle, firstStyle, secondStyle} from "../../utils/selectStyles.jsx";
import {Controller} from "react-hook-form";

const options = [
    {value: 'O1', label: 'First'},
    {value: 'O2', label: 'Second'}
];

export default function AddNewModelModal({isAddingModel, logo, alarm, onCancel, onAdd, form}) {
    const [style, setStyle] = useState(customStyle)
    const setFirstMultiBackColor = () => {
        setStyle(prevState => firstStyle(prevState))
    }
    const setSecondMultiBackColor = () => {
        setStyle(prevState => secondStyle(prevState))
    }

    return (
        <>
            <div className={`add-modal-overlay ${isAddingModel ? "" : "add-modal-overlay_hidden"}`}>
                <form onSubmit={form.handleSubmit(onAdd)} className="add-container">
                    <div className="add-modal__title">
                        <h3>Новая модель</h3>
                    </div>
                    <AlarmMsg logo={logo}>{alarm}</AlarmMsg>
                    <div className="add-modal__table">
                        <table className="change-container__table naked-input data-input">
                            <tbody>
                            <tr>
                                <td>Название<span> *</span></td>
                                <td className="text-center">
                                    <input type="text" {...form.register("name")} required/>
                                </td>
                            </tr>
                            <tr>
                                <td>URI<span> *</span></td>
                                <td className="text-center">
                                    <input type="text" {...form.register("uri")} required/>
                                </td>
                            </tr>
                            <tr>
                                <td>RunTime<span> *</span></td>
                                <td className="text-center">
                                    <input type="text" {...form.register("runtime")} required/>
                                </td>
                            </tr>
                            <tr onMouseEnter={setFirstMultiBackColor} onMouseLeave={setSecondMultiBackColor}>
                                <td>Тип задачи<span> *</span></td>
                                <td>
                                    <Controller
                                        control={form.control}
                                        name="problemType"
                                        render={({
                                                     field: {onChange, value},

                                                 }) => (
                                            <Select
                                                options={options}
                                                onChange={onChange}
                                                placeholder="Тип"
                                                value={value}
                                                isSearchable
                                                styles={style}
                                                required
                                            />
                                        )}/>
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