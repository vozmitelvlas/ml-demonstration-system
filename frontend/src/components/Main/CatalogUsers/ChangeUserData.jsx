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
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeUserDataSchema} from "../../store/formSchema.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";

const rolesOptions = [
    {value: 'ADMIN', label: 'Администратор'},
    {value: 'ORGANIZATION_HEAD', label: 'Руководитель организации'},
    {value: 'USER', label: 'Пользователь'},
];
const userDataForDisplay = {
    login: "",
    email: "",
    createdAt: "",
}


export default function ChangeUserData() {
    let navigate = useNavigate()
    const {userId} = useParams()
    const [activeBut, setActiveBut] = useState("first");
    let [isDeletingModel, setIsDeletingModel] = useState(false)
    const [displayData, setDisplayData] = useState(userDataForDisplay)
    const [logo, setLogo] = useState(alarmLogo)
    const [alarm, setAlarm] = useState(null)
    const [orgOptions, setOrgOptions] = useState([])

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        control,
    } = useForm({
        resolver: yupResolver(changeUserDataSchema)
    })


    const [userData, setUserData] = useState({})
    useEffect(() => {
        apiClient.get(`/api/admin/organizations`).then((res) => {
            let organisations = []
            res.data.forEach(org => {
                organisations.push({value: org.organizationId, label: org.name})
            })
            setOrgOptions(organisations)
        }).catch(error => {
            console.error(error)
        })

        apiClient.get(`/api/admin/users/${userId}`).then((res) => {
            console.log(res.data)
            const dataForEdit = {
                lastName: res.data.lastName,
                firstName: res.data.firstName,
                patronymic: res.data.patronymic,
                description: res.data.description,
                organization: {value: res.data.organization.organizationId, label: res.data.organization.name},
                selectRoles: rolesOptions.filter(role => res.data.roles.includes(role.value))
            }
            const dataForDisplay = {
                login: res.data.login,
                email: res.data.email,
                createdAt: res.data.createdAt,
            }

            setUserData(res.data)
            setDisplayData(dataForDisplay)
            reset(dataForEdit)
        }).catch(error => {
            console.log(error)
        })
        setAlarm(null)
    }, [activeBut]);
    useEffect(() => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            setLogo(alarmLogo)
            setAlarm(errors[firstErrorKey].message)
        }
    }, [errors]);

    const closeDeleteModal = () => {
        setIsDeletingModel(false)
    }
    const onDeleteModelClick = (event) => {
        const tr = event.target.closest("tr")
        setIsDeletingModel(true)
    }
    const [selectStyle, setSelectStyles] = useState(customStyle);
    const setFirstMultiBackColor = () => {
        setSelectStyles((prev) => firstStyle(prev));
    };
    const setSecondMultiBackColor = () => {
        setSelectStyles((prev) => secondStyle(prev));
    }
    const onSaveUserData = async (newUserData) => {
        newUserData["organizationId"] = newUserData.organization.value
        newUserData["roles"] = newUserData["selectRoles"].map(role => role.value)
        console.log(newUserData)

        try {
            await apiClient.put(`/api/admin/users/${userId}`, newUserData);
            setLogo(acceptLogo)
            setAlarm('Изменения сохранены')
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="change-container">

            <DataHeader activeBut={activeBut}
                        setActiveBut={setActiveBut}
                        buttons={["ИНФОРМАЦИЯ", "МОДЕЛИ"]}
                        names={["first", "second"]}>
                Изменение данных пользователя
            </DataHeader>

            <AlarmMsg logo={logo} alarm={alarm}></AlarmMsg>

            {activeBut === "first" && (
                <form onSubmit={handleSubmit(onSaveUserData)} className="change-content">
                    <div>
                        <table className="change-container__table naked-input data-input">
                            <tbody>
                            <tr>
                                <td>Логин</td>
                                <td className="text-center">
                                    <input type="text" value={displayData.login} disabled/>
                                </td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td className="text-center">
                                    <input type="text" value={displayData.email} disabled/>
                                </td>
                            </tr>
                            <tr>
                                <td>Дата регистрации</td>
                                <td className="text-center">
                                    <input type="text" value={getDateFormat(new Date(displayData.createdAt))} disabled/>
                                </td>
                            </tr>
                            <tr>

                                <td>Фамилия</td>
                                <td className="text-center">
                                    <input type="text" {...register("lastName")}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Имя</td>
                                <td className="text-center">
                                    <input type="text" {...register("firstName")}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Организация</td>
                                <td>
                                    <Controller
                                        control={control}
                                        name="organization"
                                        render={({
                                                     field: {onChange, value},

                                                 }) => (
                                            <Select
                                                options={orgOptions}
                                                onChange={onChange}
                                                value={value}
                                                isSearchable
                                                styles={selectStyle}
                                            />
                                        )}/>

                                </td>
                            </tr>
                            <tr onMouseEnter={setFirstMultiBackColor} onMouseLeave={setSecondMultiBackColor}>
                                <td>Роль</td>
                                <td>
                                    <Controller
                                        control={control}
                                        name="selectRoles"
                                        render={({
                                            field: {onChange, value}
                                                 }) => (
                                            <Select
                                                isMulti
                                                options={rolesOptions}
                                                onChange={onChange}
                                                value={value}
                                                closeMenuOnSelect={false}
                                                isSearchable
                                                styles={selectStyle}
                                            />
                                        )}
                                    />

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
                            navigate("/users")
                        }}>Назад</Button>
                        <Button type="submit">Сохранить</Button>
                    </div>

                </form>
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
                        <Button type="button" onClick={() => {
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