import Button from "../Button/Button.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";

export function ChangeModelInfo({submitFunction, handleSubmit, displayData, onChangeName, onBlurName, register}) {
    const navigate = useNavigate()

    return (
        <>
            <form onSubmit={handleSubmit(submitFunction)} className="change-content">
                <div>
                    <table className="change-container__table naked-input data-input">
                        <tbody>
                        <tr>
                            <td>ID</td>
                            <td className="text-center">
                                <input type="text" value={displayData.modelId} disabled/>
                            </td>
                        </tr>
                        <tr>
                            <td>Статус</td>
                            <td className="text-center">
                                <input type="text" value={displayData.status} disabled/>
                            </td>
                        </tr>
                        <tr>
                            <td>Название</td>
                            <td className="text-center">
                                <input
                                    type="text"
                                    {...register("modelName")}
                                    onChange={e => {
                                        onChangeName();
                                        register("modelName").onChange(e).then(r => {
                                        });
                                    }}
                                    onBlur={e => {
                                        onBlurName();
                                        register("modelName").onBlur(e).then(r => {
                                        });
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Версия</td>
                            <td className="text-center">
                                <input type="text" {...register("versionName")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>RunTime</td>
                            <td className="text-center">
                                <input type="text" {...register("runtime")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Тип задачи</td>
                            <td className="text-center">
                                <input type="text" {...register("problemType")}/>
                            </td>
                        </tr>

                        <tr>
                            <td>URI модели</td>
                            <td className="text-center">
                                <input type="text" {...register("uri")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Описание</td>
                            <td>
                                <textarea name="description"{...register("description")}></textarea>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="delete-modal__buttons">
                    <Button type="button" onClick={() => {navigate("/models")}}>Назад</Button>
                    <Button type="submit">Сохранить</Button>
                </div>
            </form>
        </>
    )
}