import DataHeader from "../Headers/DataHeader.jsx";
import React, {useState} from "react";
import Input from "../Input/Input.jsx";
import Button from "../Button/Button.jsx";
import {useNavigate} from "react-router-dom";
import deleteLogo from "../../../assets/delete.svg";
import DeleteModal from "../../utils/DeleteModal.jsx";

export default function ChangeOrganisations(){
    let navigate = useNavigate()
    const [activeBut, setActiveBut] = useState("first");
    let [isDeletingModel, setIsDeletingModel] = useState(false)

    let closeDeleteModal = () => {
        setIsDeletingModel(false)
    }
    let onDeleteModelClick = (event) => {
        let tr = event.target.closest("tr")
        setIsDeletingModel(true)
    }

    return(
        <div className="change-container">
            <div>
                <DataHeader
                    activeBut={activeBut}
                    setActiveBut={setActiveBut}
                    firstButton="ИНФОРМАЦИЯ"
                    secondButton="МОДЕЛИ">
                    Изменение данных организации
                </DataHeader>

                {activeBut === "first" && (
                    <div>
                        <table className="change-container__table tableHover naked-input">
                            <tbody>
                            <tr>
                                <td>Название</td>
                                <td className="text-center"><Input>Пользователи</Input></td>
                            </tr>
                            <tr>
                                <td>Руководитель (логин)</td>
                                <td className="text-center"><Input>ivan_ivanov</Input></td>
                            </tr>
                            <tr>
                                <td>Лимит</td>
                                <td className="text-center"><Input>30</Input></td>
                            </tr>
                            <tr>
                                <td>Дата создания</td>
                                <td className="text-center"><Input>17.12.2025</Input></td>
                            </tr>
                            <tr>
                                <td>Описание</td>
                                <td ><textarea id={"description"} rows="6" cols="47" defaultValue={"ADASAlasdair"}></textarea></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeBut === "second" && (
                    <div>
                        <div className="limits">
                            <h2>Установка лимита для участников организации</h2>
                            <select>
                                <option value="default">Лимит организации</option>
                                <option value="modelLimit">Лимиты модели </option>
                                <option value="userLimit">Лимиты пользователя </option>
                            </select>
                        </div>

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
                            <tbody>
                            <tr>
                                <td className="text-center">1</td>
                                <td className="text-center">Graph-based segmentation model1</td>
                                <td className="text-center"><Input>50</Input></td>
                                <td className="text-center"><Input>1000</Input></td>
                                <td className="text-center">
                                    <a className="a-img" onClick={onDeleteModelClick}><img src={deleteLogo}></img></a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="delete-modal__buttons">
                <Button onClick={() => {navigate("/users/organisations")}}>Назад</Button>
                <Button>Сохранить</Button>
            </div>

            <DeleteModal open={isDeletingModel} onNo={closeDeleteModal}></DeleteModal>
        </div>
    )
}