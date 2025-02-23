import DataHeader from "../Headers/DataHeader.jsx";
import React, {useEffect, useState} from "react";
import Button from "../Button/Button.jsx";
import {useNavigate, useParams} from "react-router-dom";
import deleteLogo from "../../../assets/delete.svg";
import DeleteModal from "../../utils/DeleteModal.jsx";
import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import acceptLogo from "../../../assets/accept.svg"
import alarmLogo from "../../../assets/alarm.svg"
import apiClient from "../../utils/axios.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeOrganisationsSchema} from "../../store/formSchema.jsx";

const limitOptions = [
    {value: 'O1', label: 'Лимит организации'},
    {value: 'O2', label: 'Лимиты модели'},
    {value: 'O2', label: 'Лимиты пользователя'}
];

const options = [
    {value: 'O1', label: 'First'},
    {value: 'O2', label: 'Second'},
    {value: 'O3', label: 'First'},
    {value: 'O4', label: 'Second'},
    {value: 'O5', label: 'First'},
    {value: 'O6', label: 'Second'},
];
const orgDataForDisplay = {
    createdAt: "",
}
const limitDataForSend = {
    rps: 0,
    requestsPerWeek: 0,
}

export default function ChangeOrganisations() {
    const navigate = useNavigate()
    const {orgId} = useParams()
    const [activeBut, setActiveBut] = useState("first")
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [displayData, setDisplayData] = useState(orgDataForDisplay)
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        resolver: yupResolver(changeOrganisationsSchema)
    })

    useEffect(() => {
        apiClient.get(`/api/admin/organizations/${orgId}`).then(res => {
            setDisplayData({
                createdAt: getDateFormat(new Date(res.data.createdAt))
            })
            reset({
                name: res.data.name,
                description: res.data.description,
                // limitsType: "USER_LIMITS",
            })

        })
    }, [])
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
        let tr = event.target.closest("tr")
        setIsDeletingModel(true)
    }
    const onSaveOrgData = async (newValue) => {
        console.log(newValue)
        try{
            await apiClient.put(`/api/admin/organizations/${orgId}`, newValue)
            setAlarm("Изменения сохранены")
            setLogo(acceptLogo)
        } catch (error) {
            if(error.response?.status === 409){
                setAlarm("Организация с таким названием уже существует")
                setLogo(alarmLogo)
            }
        }

    }

    return (
        <div className="change-container">
            <DataHeader
                activeBut={activeBut}
                setActiveBut={setActiveBut}
                firstButton="ИНФОРМАЦИЯ"
                secondButton="МОДЕЛИ">
                Изменение данных организации
            </DataHeader>

            <AlarmMsg logo={logo} alarm={alarm}></AlarmMsg>

            {activeBut === "first" && (
                <form onSubmit={handleSubmit(onSaveOrgData)} className="change-content">
                    <div>
                        <table className="change-container__table tableHover naked-input data-input">
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
            )}

            {activeBut === "second" && (
                    <form className="change-content">
                        <div className="change-orgs-content">
                            <div className="select-container">
                                <div>
                                    <h2>Установка лимитов и моделей</h2>
                                    <div className="orgs-selects">
                                        <Select
                                            className="limits-select naked-input"
                                            options={limitOptions}
                                            // onChange={handleSelectChange}
                                            closeMenuOnSelect={false}
                                            placeholder="Лимит"
                                            isSearchable
                                            styles={customStyle}
                                        />
                                        <Select
                                            className="limits-select naked-input"
                                            isMulti
                                            options={options}
                                            // onChange={handleSelectChange}
                                            closeMenuOnSelect={false}
                                            placeholder="Модели"
                                            isSearchable
                                            styles={customStyle}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="orgs-models">
                                <h2>Доступные организации модели</h2>
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
                                        <td className="text-center">Graph-based segmentation model1</td>
                                        <td className="text-center"><input type="text" defaultValue={""}/>
                                        </td>
                                        <td className="text-center"><input type="text" defaultValue={""}/></td>
                                        <td className="text-center">
                                            <a className="a-img" onClick={onDeleteModelClick}><img
                                                src={deleteLogo}></img></a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>


                        <div className="delete-modal__buttons">
                            <Button type="button" onClick={() => {navigate("/organisations")}}>Назад</Button>
                            <Button type="submit">Сохранить</Button>
                        </div>
                    </form>
            )}

            <DeleteModal open={isDeletingModel} onNo={closeDeleteModal}></DeleteModal>
        </div>
    )
}