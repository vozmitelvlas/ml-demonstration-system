import Button from "../../Buttons/Button.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";

export function ChangeModelLimit({form, submitFunction}) {
    const navigate = useNavigate()
    return(
        <>
            <form onSubmit={form.handleSubmit(submitFunction)} className="change-content">
                <div>
                    <h2>Лимиты по умолчанию</h2>
                    <table className="change-container__table naked-input">
                        <tbody>
                        <tr>
                            <td>Лимит RPS</td>
                            <td>
                                <input type="text"{...form.register("rps")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Лимит запросов/нед</td>
                            <td>
                                <input type="text"{...form.register("requestsPerWeek")}/>
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