import DataHeader from "../Headers/DataHeader.jsx";
import React from "react";
import Input from "../../Input.jsx";
import Button from "../../Button.jsx";
import {useNavigate} from "react-router-dom";
import deleteLogo from "../../../assets/delete.svg";

function ChangeOrganisations(){
    let navigate = useNavigate()

    let closeModal = (event) => {
        event.preventDefault()
        if (event.target.closest(".delete-modal")) {
            let modalWindow = document.querySelector(".delete-modal-overlay");
            modalWindow.classList.add("delete-modal-overlay_hidden");
        }
    }
    let clickOnTbody = (event) => {
        let deleteRef = event.target.closest('[name="deleteLogo"]')

        let tr = event.target.closest("tr")
        if (deleteRef) {
            let deleteModal = document.querySelector(".delete-modal-overlay")
            deleteModal.classList.remove("delete-modal-overlay_hidden")
        }
    }


    return(
        <div className="change-container">
            <div>
                <DataHeader firstButton="ИНФОРМАЦИЯ" secondButton="МОДЕЛИ">Изменение данных организации</DataHeader>

                <div className="change-container__info">
                    <table className="change-container__table tableHover naked-input">
                        <tbody>
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

                <div className="change-container__second" hidden>
                    <h2>Доступные организации модели</h2>
                    <table className="change-container__table tableHover naked-input">
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
                            <th></th>
                        </tr>
                        </thead>
                        <tbody onClick={clickOnTbody}>
                        <tr>
                            <td className="text-center">1</td>
                            <td className="text-center">Graph-based segmentation model1</td>
                            <td className="text-center"><Input>50</Input></td>
                            <td className="text-center"><Input>1000</Input></td>
                            <td className="text-center">
                                <a className="a-img" name="deleteLogo"><img src={deleteLogo}></img></a>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">2</td>
                            <td className="text-center">Graph-based segmentation model2</td>
                            <td className="text-center"><Input>10</Input></td>
                            <td className="text-center"><Input>-</Input></td>
                            <td className="text-center">
                                <a className="a-img" name="deleteLogo"><img src={deleteLogo}></img></a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="delete-modal__buttons">
                <Button onClick={() => {navigate("/users/organisations")}}>Назад</Button>
                <Button>Сохранить</Button>
            </div>

            <div className="delete-modal-overlay delete-modal-overlay_hidden">
                <div className="delete-modal">
                    <div className="add-modal__title">
                        <h3>
                            Вы действительно хотите удалить эту модель?
                        </h3>
                    </div>

                    <div className="delete-modal__buttons">
                        <Button onClick={closeModal}>Нет</Button>
                        <Button>Да</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChangeOrganisations