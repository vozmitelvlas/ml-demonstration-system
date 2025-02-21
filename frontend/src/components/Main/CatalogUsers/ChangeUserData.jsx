import DataHeader from "../Headers/DataHeader.jsx";
import React, {useEffect, useState} from "react";

import Button from "../Button/Button.jsx";
import {useNavigate, useParams} from "react-router-dom";
import deleteLogo from "../../../assets/delete.svg";
import DeleteModal from "../../utils/DeleteModal.jsx";
import Select from "react-select";
import {customStyle, firstStyle, secondStyle} from "../../utils/selectStyles.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import alarmLogo from "../../../assets/alarm.svg";
import acceptLogo from "../../../assets/accept.svg";
import apiClient from "../../utils/axios.jsx";

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
    const {userId} = useParams()
    const [activeBut, setActiveBut] = useState("first");
    let [isDeletingModel, setIsDeletingModel] = useState(false)
    const [logo, setLogo] = useState(alarmLogo)
    const [alarm, setAlarm] = useState(null)


    const [userInfo, setUserInfo] = useState({})
    useEffect(() => {
        try {
            apiClient.get(`/admin/users/${userId}`).then((res) => {})
        } catch (error) {
            console.log(error)
        }
    }, [activeBut]);

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

                <DataHeader activeBut={activeBut}
                            setActiveBut={setActiveBut}
                            firstButton="ИНФОРМАЦИЯ"
                            secondButton="МОДЕЛИ">
                    Изменение данных пользователя
                </DataHeader>

                <AlarmMsg logo={logo} alarm={alarm}></AlarmMsg>

                {activeBut === "first" && (
                    <div className="change-content">
                        <div>
                            <table className="change-container__table naked-input data-input">
                                <tbody>
                                <tr>
                                    <td>Логин</td>
                                    <td className="text-center"><input type="text" defaultValue={""} disabled/></td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td className="text-center"><input type="text" defaultValue={""} disabled/></td>
                                </tr>
                                <tr>
                                    <td>Дата регистрации</td>
                                    <td className="text-center"><input type="text" defaultValue={""} disabled/></td>
                                </tr>
                                <tr>
                                    <td>Фамилия</td>
                                    <td className="text-center"><input type="text" defaultValue={""}/></td>
                                </tr>
                                <tr>
                                    <td>Имя</td>
                                    <td className="text-center"><input type="text" defaultValue={""}/></td>
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
                                    <td><textarea></textarea></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="delete-modal__buttons">
                            <Button onClick={() => {
                                navigate("/users")
                            }}>Назад</Button>
                            <Button>Сохранить</Button>
                        </div>

                    </div>
                )}
                {activeBut === "second" && (
                    <form className="change-content">
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
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="text-center">1</td>
                                    <td className="text-center">Graph-based segmentation model</td>
                                    <td className="text-center"><input type="text" defaultValue={""}/></td>
                                    <td className="text-center"><input type="text" defaultValue={""}/></td>
                                    <td className="text-center">
                                        <a className="a-img" onClick={onDeleteModelClick}><img
                                            src={deleteLogo}></img></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-center">2</td>
                                    <td className="text-center">Graph-based segmentation model</td>
                                    <td className="text-center"><input type="text" defaultValue={""}/></td>
                                    <td className="text-center"><input type="text" defaultValue={""}/></td>
                                    <td className="text-center">
                                        <a className="a-img" onClick={onDeleteModelClick}><img
                                            src={deleteLogo}></img></a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="delete-modal__buttons">
                            <Button onClick={() => {
                                navigate("/users")
                            }}>Назад</Button>
                            <Button>Сохранить</Button>
                        </div>
                    </form>
                )}


            <DeleteModal onNo={closeDeleteModal} open={isDeletingModel}></DeleteModal>
        </div>

    )

}