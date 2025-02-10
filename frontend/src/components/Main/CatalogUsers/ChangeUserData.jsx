import DataHeader from "../Headers/DataHeader.jsx";
import React, {useState} from "react";
import Input from "../Input/Input.jsx";
import Button from "../Button/Button.jsx";
import {useNavigate} from "react-router-dom";
import deleteLogo from "../../../assets/delete.svg";
import DeleteModal from "../../utils/DeleteModal.jsx";
import Select from "react-select";
import {customStyle, firstStyle, secondStyle} from "../../utils/selectStyles.jsx";

const roleOptions = [
    {value: 'O1', label: 'Администратор'},
    {value: 'O2', label: 'Пользователь'},
    {value: '03', label: 'Руководитель организации'},
];
const orgOptions = [
    {value: 'O1', label: 'Администраторы'},
    {value: 'O2', label: 'Пользователи'},
];

export default function ChangeUserData() {
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
    const [selectStyle, setSelectStyles] = useState(customStyle);
    const setFirstMultiBackColor = () => {
        setSelectStyles((prev) => firstStyle(prev));
    };
    const setSecondMultiBackColor = () => {
        setSelectStyles((prev) => secondStyle(prev));
    }

    return (
        <div className="change-container">
            <div>
                <DataHeader activeBut={activeBut}
                            setActiveBut={setActiveBut}
                            firstButton="ИНФОРМАЦИЯ"
                            secondButton="МОДЕЛИ">
                    Изменение данных пользователя
                </DataHeader>

                {activeBut === "first" && (
                    <div>
                        <table className="change-container__table tableHover naked-input">
                            <tbody>
                            <tr>
                                <td>Логин</td>
                                <td className="text-center"><Input>ivanov_ivan</Input></td>
                            </tr>
                            <tr>
                                <td>Фамилия</td>
                                <td className="text-center"><Input>Ivanov</Input></td>
                            </tr>
                            <tr>
                                <td>Имя</td>
                                <td className="text-center"><Input>Ivan</Input></td>
                            </tr>
                            <tr>
                                <td>Дата регистрации</td>
                                <td className="text-center"><Input>17.09.2025</Input></td>
                            </tr>
                            <tr>
                                <td>Организация</td>
                                <td>
                                    <Select
                                        options={orgOptions}
                                        // onChange={handleSelectChange}
                                        closeMenuOnSelect={false}
                                        placeholder={"Пользователи"}
                                        isSearchable
                                        styles={selectStyle}
                                    />
                                </td>
                            </tr>
                            <tr onMouseEnter={setFirstMultiBackColor} onMouseLeave={setSecondMultiBackColor}>
                                <td>Роль</td>
                                <td>
                                    <Select
                                        isMulti
                                        options={roleOptions}
                                        // onChange={handleSelectChange}
                                        closeMenuOnSelect={false}
                                        placeholder={"Пользователь"}
                                        isSearchable
                                        styles={selectStyle}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Описание</td>
                                <td><textarea defaultValue={"Asdasd"}></textarea></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                {activeBut === "second" && (
                    <div>
                        <h2>Доступные пользователю модели</h2>
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
                                <td className="text-center">Graph-based segmentation model</td>
                                <td className="text-center"><Input>50</Input></td>
                                <td className="text-center"><Input>1000</Input></td>
                                <td className="text-center">
                                    <a className="a-img" onClick={onDeleteModelClick}><img
                                        src={deleteLogo}></img></a>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-center">2</td>
                                <td className="text-center">Graph-based segmentation model</td>
                                <td className="text-center"><Input>10</Input></td>
                                <td className="text-center"><Input>-</Input></td>
                                <td className="text-center">
                                    <a className="a-img" onClick={onDeleteModelClick}><img
                                        src={deleteLogo}></img></a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            <div className="delete-modal__buttons">
                <Button onClick={() => {
                    navigate("/users")
                }}>Назад</Button>
                <Button>Сохранить</Button>
            </div>


            <DeleteModal onNo={closeDeleteModal} open={isDeletingModel}></DeleteModal>
        </div>

    )

}