import React, {useEffect, useState} from "react";
import styles from "./MyOrganisations.module.css"
import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";
import apiClient from "../../utils/axios.jsx";
import {useNavigate, useParams} from "react-router-dom";
import alarmLogo from "../../../assets/alarm.svg";
import acceptLogo from "../../../assets/accept.svg";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import Button from "../Button/Button.jsx";

const limitOptions = [
    {value: 'ORGANIZATION_LIMITS', label: 'Лимит организации'},
    {value: 'USER_LIMITS', label: 'Лимиты пользователя'},
    {value: 'MODEL_LIMITS', label: 'Лимиты модели'}
];

export default function MyOrganisations() {
    const navigate = useNavigate()
    const {orgId} = useParams()
    const [logo, setLogo] = useState(alarmLogo)
    const [alarm, setAlarm] = useState(null)
    const [myOrg, setMyOrg] = useState({})
    const [members, setMembers] = useState([])
    const [limit, setLimit] = useState({})

    useEffect(() => {
        apiClient.get(`/api/organizations/${orgId}`).then(res => {
            setMyOrg(res.data)
            setLimit(limitOptions.find(limit => res.data.limitsType === limit.value))
        })
        apiClient.get(`/api/organizations/${orgId}/members`).then(res => {
            setMembers(res.data)
        })
    }, []);

    const handleSelectChange = (newValue) => {
        setLimit(newValue)
    }
    const handleSubmit = async () => {
        event.preventDefault()
        const sendData = {
            limitsType: limit.value
        }
        console.log(limit, sendData)
        try {
            await apiClient.put(`/api/organizations/${orgId}/limits-type`, sendData)
            setLogo(acceptLogo)
            setAlarm("Лимит успешно установлен")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <main>
                <div className={styles.header}>
                    <h1>Моя организация</h1>
                </div>

                <div className={styles.content}>
                    <div className={styles.info}>
                        <div>
                            <h2>Название организации - <span>{myOrg.name}</span></h2>
                        </div>
                        <div>
                            <h2>Описание:</h2>
                            <textarea defaultValue={myOrg.description} disabled></textarea>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <h2>Установка лимита для участников организации:</h2>
                            <div className={styles.limits}>
                                <Select
                                    className={"limits-select naked-input"}
                                    options={limitOptions}
                                    value={limit}
                                    onChange={handleSelectChange}
                                    isSearchable
                                    styles={customStyle}
                                />
                                <button type="submit" className={styles.button}>Сохранить</button>
                                <AlarmMsg logo={logo}>{alarm}</AlarmMsg>
                            </div>
                        </form>
                    </div>

                    <div className={styles.users}>
                        <h2>Участники организации:</h2>
                        <div className={styles.table}>
                            <table className="change-container__table">
                                <tbody>
                                {members.map((member, ind) => (
                                    <tr key={ind}>
                                        <td className={styles.memberId}>{ind + 1}</td>
                                        <td className={`text-center member ${styles.member}`}>{member.lastName} {member.firstName} ({member.email})</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                <div className={styles.backBut}>
                    <Button onClick={() => {navigate("/models")}}>Назад</Button>
                </div>

            </main>
        </>
    )
}