import Button from "../Button/Button.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function ChangeUserLimits({userLimits, register, handleSubmit, submitFunction, onInputChange}) {
    const navigate = useNavigate()
    return (
        <form onSubmit={handleSubmit(submitFunction)} className="change-content">
            <div className="user-models">
                <h2>Доступные пользователю модели</h2>
                <table className="table-fill naked-input limits-input">
                    <thead>
                    <tr>
                        <th className="text-center">
                            <strong>ID</strong>
                        </th>
                        <th className="text-center">
                            <strong>Название</strong>
                        </th>
                        <th className="text-center">
                            <strong>Лимит RPS</strong>
                        </th>
                        <th className="text-center">
                            <strong>Лимит запросов/нед</strong>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {userLimits.map(model => (
                        <tr key={model.modelId}>
                            <td className="text-center">{model.modelId}</td>
                            <td className="text-center">{model.modelName}</td>
                            <td className="text-center">
                                <input type="text" {...register(`rps${model.modelId}`)} onChange={e => {
                                    onInputChange(e);
                                    register(`rps${model.modelId}`).onChange(e).then(r => {
                                    });
                                }}/>
                            </td>
                            <td className="text-center">
                                <input type="text" {...register(`requestsPerWeek${model.modelId}`)} onChange={e => {
                                    onInputChange(e);
                                    register(`requestsPerWeek${model.modelId}`).onChange(e).then(r => {
                                    });
                                }}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="delete-modal__buttons">
                <Button type="button" onClick={() => {
                    navigate("/users")
                }}>Назад</Button>
                <Button type="submit">Сохранить</Button>
            </div>
        </form>
    )
}