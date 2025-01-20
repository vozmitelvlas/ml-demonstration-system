import DataHeader from "../Headers/DataHeader.jsx";
import React from "react";
import Input from "../../Input.jsx";
import Button from "../../Button.jsx";
import {useNavigate} from "react-router-dom";

function ChangeOrganisations(){
    let navigate = useNavigate()
    return(
        <div className="change-container">
            <div>
                <DataHeader firstButton="ИНФОРМАЦИЯ" secondButton="МОДЕЛИ">Изменение данных организации</DataHeader>

                <div className="change-container__info">
                    <table className="change-container__table">

                        <tbody className="naked-input">
                        <tr>
                            <td>Название</td>
                            <td><Input>Пользователи</Input></td>
                        </tr>
                        <tr>
                            <td>Дата создания</td>
                            <td><Input>17.12.2025</Input></td>
                        </tr>
                        <tr>
                            <td>Описание</td>
                            <td><textarea id={"description"} rows="10" cols="50" defaultValue={"ADASAlasdair"}></textarea></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="change-container__second tableHover" hidden>
                    <h2>Доступные организации модели</h2>
                    <table className="change-container__table">
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
                        <tbody className="naked-input">
                        <tr>
                            <td className="text-center">1</td>
                            <td className="text-center">Graph-based segmentation model1</td>
                            <td className="text-center">50</td>
                            <td className="text-center">1000</td>
                        </tr>
                        <tr>
                            <td className="text-center">2</td>
                            <td className="text-center">Graph-based segmentation model2</td>
                            <td className="text-center">10</td>
                            <td className="text-center">-</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="delete-modal__buttons">
                <Button onClick={() => {navigate("/users")}}>Назад</Button>
                <Button>Сохранить</Button>
            </div>
        </div>
    )
}
export default ChangeOrganisations