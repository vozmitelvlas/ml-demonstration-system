import Button from "../../Buttons/Button.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";


export function ChangeOrganisationInfo({submitFunction, form, onInputFocus}) {
    const navigate = useNavigate()
    const toOrgs = () => navigate("/organisations")

    return (
        <form onSubmit={form.handleSubmit(submitFunction)} className="change-content" onFocus={onInputFocus}>
            <div>
                <table className="change-container__table naked-input data-input">
                    <tbody>
                    <tr>
                        <td>Дата создания</td>
                        <td className="text-center">
                            <input type="text" {...form.register("createdAt")} disabled/>
                        </td>
                    </tr>
                    <tr>
                        <td>Название</td>
                        <td className="text-center">
                            <input type="text" {...form.register("name")}/>
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
                <Button type="button" onClick={toOrgs}>Назад</Button>
                <Button type="submit">Сохранить</Button>
            </div>

        </form>
    )

}