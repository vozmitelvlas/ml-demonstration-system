import Button from "../../../components/Buttons/Button.jsx";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Controller} from "react-hook-form";
import Select from "react-select";
import {customStyle} from "../../../utils/selectStyles.jsx";
import {useSelector} from "react-redux";
import {selectProblemTypes, selectRunTimes} from "../../../selectors/model-selectors.js";

export function ChangeModelInfo({form, submitFunction, onChangeName, onBlurName, onInputFocus}) {
    const navigate = useNavigate()
    const [runTimeStyle, setRunTimeStyle] = useState(customStyle)
    const [problemStyle, setProblemStyle] = useState(customStyle)

    const problemTypes = useSelector(selectProblemTypes)
    const runtimes = useSelector(selectRunTimes)

    return (
        <form onSubmit={form.handleSubmit(submitFunction)} className="change-content" onFocus={onInputFocus}>
            <div>
                <table className="change-container__table naked-input data-input">
                    <tbody>
                    <tr>
                        <td>ID</td>
                        <td className="text-center">
                            <input type="text" {...form.register("modelId")} disabled/>
                        </td>
                    </tr>
                    <tr>
                        <td>Статус</td>
                        <td className="text-center">
                            <input type="text" {...form.register("status")} disabled/>
                        </td>
                    </tr>
                    <tr>
                        <td>Название</td>
                        <td className="text-center">
                            <input
                                type="text"
                                {...form.register("modelName")}
                                onChange={e => {
                                    onChangeName();
                                    form.register("modelName").onChange(e).then(r => {
                                    });
                                }}
                                onBlur={e => {
                                    onBlurName();
                                    form.register("modelName").onBlur(e).then(r => {
                                    });
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Версия</td>
                        <td className="text-center">
                            <input type="text" {...form.register("versionName")}/>
                        </td>
                    </tr>
                    <tr>
                        <td>RunTime</td>
                        <td className="text-center">
                            <Controller
                                control={form.control}
                                name="runtime"
                                render={({
                                             field: {onChange, value},

                                         }) => (
                                    <Select
                                        options={runtimes}
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
                    <tr>
                        <td>Тип задачи</td>
                        <td className="text-center">
                            <Controller
                                control={form.control}
                                name="problemType"
                                render={({
                                             field: {onChange, value},

                                         }) => (
                                    <Select
                                        options={problemTypes}
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
                        <td>URI модели</td>
                        <td className="text-center">
                            <input type="text" {...form.register("uri")}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Описание</td>
                        <td>
                            <textarea name="description"{...form.register("description")}></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="delete-modal__buttons">
                <Button type="button" onClick={() => {
                    navigate("/models")
                }}>Назад</Button>
                <Button type="submit">Сохранить</Button>
            </div>
        </form>
    )
}