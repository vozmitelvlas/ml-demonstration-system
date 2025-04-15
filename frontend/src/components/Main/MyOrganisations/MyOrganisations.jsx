import React, {useEffect, useState} from "react";
import styles from "./MyOrganisations.module.css"
import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import Button from "../Buttons/Button.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getOrgDataAction, getOrgMembersAction, setOrgLimitAction} from "../../../actions/org-actions.js";
import {selectOrg, selectOrgMembers} from "../../../selectors/org-selector.js";
import {selectMessageState} from "../../../selectors/message-selector.js";
import {resetMessageStateAction, setAcceptMessageAction} from "../../../actions/message-actions.js";

const limitOptions = [
    {value: 'ORGANIZATION_LIMITS', label: 'Лимит организации'},
    {value: 'USER_LIMITS', label: 'Лимиты пользователя'},
    {value: 'MODEL_LIMITS', label: 'Лимиты модели'}
]

export default function MyOrganisations() {
    const {orgId} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const org = useSelector(selectOrg)
    const members = useSelector(selectOrgMembers)
    const {message, logo} = useSelector(selectMessageState)
    const [limit, setLimit] = useState({})

    useEffect(() => {
        dispatch(getOrgDataAction(orgId)).then((res) => {
            setLimit(limitOptions.find(limit => res.limitsType === limit.value))
        })
        dispatch(getOrgMembersAction(orgId))
        dispatch(resetMessageStateAction)
    }, [])

    const handleSelectChange = (newValue) => setLimit(newValue)
    const onLimitSelectFocus = () => dispatch(resetMessageStateAction)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const payload = {
            id: orgId,
            body: {
                limitsType: limit.value
            }
        }
        dispatch(setOrgLimitAction(payload)).then(() => {
            dispatch(setAcceptMessageAction("Лимит успешно установлен"))
        })
    }


    return (
        <main>
            <div className={styles.header}>
                <h1>Моя организация</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.info}>
                    <div>
                        <h2>Название организации - <span>{org.name}</span></h2>
                    </div>
                    <div>
                        <h2>Описание:</h2>
                        <textarea defaultValue={org.description} disabled></textarea>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <h2>Установка лимита для участников организации:</h2>
                        <div className={styles.limits}>
                            <Select
                                className={"limits-select naked-input"}
                                options={limitOptions}
                                value={limit}
                                onChange={handleSelectChange}
                                onFocus={onLimitSelectFocus}
                                isSearchable
                                styles={customStyle}
                            />
                            <button type="submit" className={styles.button}>Сохранить</button>
                            <AlarmMsg logo={logo}>{message}</AlarmMsg>
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
                <Button onClick={() => {
                    navigate("/models")
                }}>Назад</Button>
            </div>

        </main>
    )
}