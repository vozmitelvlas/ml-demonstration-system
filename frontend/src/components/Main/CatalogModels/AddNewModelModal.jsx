import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import Select from "react-select";
import Button from "../Button/Button.jsx";
import React, {useState} from "react";
import {customStyle, setFirstMultiBackColor, setSecondMultiBackColor} from "../../utils/selectStyles.jsx";
import {Controller} from "react-hook-form";

const problemTypesOptions = [
    {value: 'IMAGE_CLASSIFICATION', label: 'Классификация изображений'},
    {value: 'NLP', label: 'Обработка естественного языка'}
]
const runtimeOptions = [
    {value: 'TRITON_INFERENCE_SERVER', label: 'Triton Inference Server'},
    {value: 'MONAI_DEPLOY', label: 'MONAI Deploy'}
]

export default function AddNewModelModal({isAddingModel, logo, alarm, onCancel, onAdd, form}) {
    const [runTimeStyle, setRunTimeStyle] = useState(customStyle)
    const [problemStyle, setProblemStyle] = useState(customStyle)

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
                            <tr onMouseEnter={event => setFirstMultiBackColor(event, setRunTimeStyle, setProblemStyle)}
                                onMouseLeave={event => setSecondMultiBackColor(event, setRunTimeStyle, setProblemStyle)}
                                data-name={"first"}>
                                <td>RunTime<span> *</span></td>
                                <td className="text-center">
                                    <Controller
                                        control={form.control}
                                        name="runtime"
                                        render={({
                                                     field: {onChange, value},

                                                 }) => (
                                            <Select
                                                options={runtimeOptions}
                                                onChange={onChange}
                                                placeholder="Тип"
                                                value={value}
                                                isSearchable
                                                styles={runTimeStyle}
                                                required
                                            />
                                        )}/>
                                </td>
                            </tr>
                            <tr onMouseEnter={event => setFirstMultiBackColor(event, setRunTimeStyle, setProblemStyle)}
                                onMouseLeave={event => setSecondMultiBackColor(event, setRunTimeStyle, setProblemStyle)}
                                data-name={"second"}>
                                <td>Тип задачи<span> *</span></td>
                                <td>
                                    <Controller
                                        control={form.control}
                                        name="problemType"
                                        render={({
                                                     field: {onChange, value},

                                                 }) => (
                                            <Select
                                                options={problemTypesOptions}
                                                onChange={onChange}
                                                placeholder="Тип"
                                                value={value}
                                                isSearchable
                                                styles={problemStyle}
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