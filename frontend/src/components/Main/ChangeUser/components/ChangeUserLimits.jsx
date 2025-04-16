import Button from "../../Buttons/Button.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUserLimits} from "../../../../selectors/user-selector.js";

export function ChangeUserLimits({form, submitFunction, onInputFocus}) {
    const navigate = useNavigate()
    const userLimits = useSelector(selectUserLimits)
    return (
        <form onSubmit={form.handleSubmit(submitFunction)} className="change-content" onFocus={onInputFocus}>
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
                                <input type="text" {...form.register(`rps${model.modelId}`)}/>
                            </td>
                            <td className="text-center">
                                <input type="text" {...form.register(`requestsPerWeek${model.modelId}`)}/>
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