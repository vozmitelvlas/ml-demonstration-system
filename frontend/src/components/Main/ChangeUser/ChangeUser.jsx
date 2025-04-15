import DataHeader from "../Headers/DataHeader/DataHeader.jsx";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeUserDataSchema, limitsSchema} from "../../store/formSchema.jsx";
import {ChangeUserInfo, ChangeUserLimits} from "./components";
import {useDispatch, useSelector} from "react-redux";
import {getFormatOrganisationsAction} from "../../../actions/admin-org-actions.js";
import {
    getUserDataAction, getUserLimitsAction,
    updateUserDataAsAdminAction, updateUserLimits
} from "../../../actions/admin-user-actions.js";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import {selectFormatUserLimits} from "../../../selectors/user-selector.js";
import {
    resetMessageStateAction, setAcceptMessageAction, setRejectMessageAction
} from "../../../actions/message-actions.js";
import {selectMessageState} from "../../../selectors/message-selector.js";
import {useErrorHookForm} from "../../../hooks/error-hooks.js";

const rolesOptions = [
    {value: 'ADMIN', label: 'Администратор'},
    {value: 'ORGANIZATION_HEAD', label: 'Руководитель организации'},
    {value: 'USER', label: 'Пользователь'},
]

export default function ChangeUser() {
    const {userId} = useParams()
    const dispatch = useDispatch()
    const formatUserLimits = useSelector(selectFormatUserLimits)
    const {message, logo} = useSelector(selectMessageState)
    const [activeBut, setActiveBut] = useState("first")
    const firstForm = useForm({
        resolver: yupResolver(changeUserDataSchema)
    })
    const secondForm = useForm({
        resolver: yupResolver(limitsSchema)
    })

    useEffect(() => {
        dispatch(getFormatOrganisationsAction)
        dispatch(getUserDataAction(userId)).then(res => {
            firstForm.reset({
                ...res,
                createdAt: getDateFormat(new Date(res.createdAt)),
                organization: {value: res.organization.organizationId, label: res.organization.name},
                selectRoles: rolesOptions.filter(role => res.roles.includes(role.value))
            })
        })
    }, [])
    useEffect(() => {
        dispatch(getUserLimitsAction(userId)).then(() =>
            secondForm.reset(formatUserLimits)
        )
        dispatch(resetMessageStateAction)
    }, [activeBut])

    useErrorHookForm(activeBut, firstForm, secondForm)

    const onInputChange = () => dispatch(resetMessageStateAction)

    const onSaveUserData = (newUserData) => {
        const payload = {
            userId,
            body: {
                ...newUserData,
                organizationId: newUserData.organization.value,
                roles: newUserData["selectRoles"].map(role => role.value)
            }
        }
        dispatch(updateUserDataAsAdminAction(payload)).then(() => {
                dispatch(getUserLimitsAction(userId)).then(() =>
                    secondForm.reset(formatUserLimits)
                )
                dispatch(setAcceptMessageAction('Изменения сохранены'))
            }
        )
    }

    const onSaveUserLimit = (newValue) => {
        const entries = Object.entries(newValue)
        for (let i = 0; i < entries.length; i += 2) {
            const chunk = entries.slice(i, i + 2)
            let modelId
            const trueChunk = chunk.map(([key, value]) => {
                const [newKey, lastChar] = key.match(/^(.*)(.)$/).slice(1)
                modelId = lastChar
                return [newKey, value]
            })
            const chunkAsObject = Object.fromEntries(trueChunk)

            const payload = {
                userId,
                modelId,
                body: chunkAsObject
            }
            dispatch(updateUserLimits(payload))
        }
        dispatch(setAcceptMessageAction("Изменения сохранены"))
    }

    return (
        <div className="change-container">

            <DataHeader activeBut={activeBut}
                        setActiveBut={setActiveBut}
                        buttons={["ИНФОРМАЦИЯ", "ЛИМИТ И МОДЕЛИ"]}
                        names={["first", "second"]}>
                Изменение данных пользователя
            </DataHeader>

            <AlarmMsg logo={logo}>{message}</AlarmMsg>

            {activeBut === "first" && (
                <ChangeUserInfo
                    form={firstForm}
                    submitFunction={onSaveUserData}
                    rolesOptions={rolesOptions}
                />
            )}
            {activeBut === "second" && (
                <ChangeUserLimits
                    form={secondForm}
                    submitFunction={onSaveUserLimit}
                    onInputChange={onInputChange}
                />
            )}
        </div>

    )

}