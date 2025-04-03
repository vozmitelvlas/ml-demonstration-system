import Button from "../Buttons/Button.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";


export default function ChangeOrganisationInfo({submitFunction, handleSubmit, displayData, register}) {
    const navigate = useNavigate()
    return (
        <>
            <form onSubmit={handleSubmit(submitFunction)} className="change-content">
                <div>
                    <table className="change-container__table naked-input data-input">
                        <tbody>
                        <tr>
                            <td>Дата создания</td>
                            <td className="text-center">
                                <input type="text" value={displayData.createdAt} disabled/>
                            </td>
                        </tr>
                        <tr>
                            <td>Название</td>
                            <td className="text-center">
                                <input type="text" {...register("name")}/>
                            </td>
                        </tr>

                        <tr>
                            <td>Описание</td>
                            <td>
                                <textarea {...register("description")}></textarea>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="delete-modal__buttons">
                    <Button type="button" onClick={() => {
                        navigate("/organisations")
                    }}>Назад</Button>
                    <Button type="submit">Сохранить</Button>
                </div>

            </form>
        </>
    )

}