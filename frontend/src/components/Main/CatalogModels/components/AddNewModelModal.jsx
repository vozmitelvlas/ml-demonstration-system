import {AlarmMsg} from "../../AlarmMsg/AlarmMsg.jsx";
import Select from "react-select";
import Button from "../../Buttons/Button.jsx";
import React, {useEffect, useState} from "react";
import {customStyle, setFirstMultiBackColor, setSecondMultiBackColor} from "../../../utils/selectStyles.jsx";
import {Controller} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {selectProblemTypes, selectRunTimes} from "../../../../selectors/model-selectors.js";
import {resetMessageStateAction} from "../../../../actions/message-actions.js";
import {selectMessageState} from "../../../../selectors/message-selector.js";
import {getProblemTypesAction, getRunTimesAction} from "../../../../actions/model-actions.js";

export function AddNewModelModal({isAddingModel, onAdd, form, setIsAddingModel, isConfirmed}) {
    const dispatch = useDispatch()
    const runtimes = useSelector(selectRunTimes)
    const problemTypes = useSelector(selectProblemTypes)
    const {message, logo} = useSelector(selectMessageState)
    const [runTimeStyle, setRunTimeStyle] = useState(customStyle)
    const [problemStyle, setProblemStyle] = useState(customStyle)

    useEffect(() => {
        if(isConfirmed){
            dispatch(getRunTimesAction)
            dispatch(getProblemTypesAction)
        }
    }, [isConfirmed])

    const onCancel = () => {
        setIsAddingModel(!isAddingModel)
        dispatch(resetMessageStateAction)
    }

    return (
        <>
            <div className={`add-modal-overlay ${isAddingModel ? "" : "add-modal-overlay_hidden"}`}>
                <form onSubmit={form.handleSubmit(onAdd)} className="add-container">
                    <div className="add-modal__title">
                        <h3>Новая модель</h3>
                    </div>
                    <AlarmMsg logo={logo}>{message}</AlarmMsg>
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