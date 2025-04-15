import DataHeader from "../Headers/DataHeader/DataHeader.jsx";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeOrganisationsSchema, limitsSchema} from "../../store/formSchema.jsx";
import {ChangeOrganisationInfo, ChangeOrganisationModels} from "./components/index.js";
import {useDispatch, useSelector} from "react-redux";
import {
    addOrgModelAction, deleteOrgModelAction, getOrganisationByIdAction,
    getOrgModelsAction, updateOrgDataAction, updateOrgLimitTypeAction, updateOrgModelsLimitsAction
} from "../../../actions/admin-org-actions.js";
import {selectMessageState} from "../../../selectors/message-selector.js";
import {
    resetMessageStateAction, setAcceptMessageAction, setRejectMessageAction
} from "../../../actions/message-actions.js";
import {getFormatModelsAction} from "../../../actions/admin-model-actions.js";
import {selectAllModels, selectFormatModels} from "../../../selectors/model-selectors.js";
import {selectFormatOrgLimits, selectOrgModels} from "../../../selectors/org-selector.js";
import {useErrorHookForm} from "../../../hooks/error-hooks.js";

const limitOptions = [
    {value: 'ORGANIZATION_LIMITS', label: 'Лимит организации'},
    {value: 'MODEL_LIMITS', label: 'Лимиты модели'},
    {value: 'USER_LIMITS', label: 'Лимиты пользователя'}
]

export default function ChangeOrganisation() {
    const {orgId} = useParams()
    const [activeBut, setActiveBut] = useState("first")
    const [limitsType, setLimitsType] = useState(null)
    const firstForm = useForm({
        resolver: yupResolver(changeOrganisationsSchema)
    })
    const secondForm = useForm({
        resolver: yupResolver(limitsSchema)
    })

    const dispatch = useDispatch()
    const {message, logo} = useSelector(selectMessageState)
    const formatModels = useSelector(selectFormatModels)
    const allModels = useSelector(selectAllModels)
    const formatOrgLimits = useSelector(selectFormatOrgLimits)
    const orgModels = useSelector(selectOrgModels)

    useEffect(() => {
        dispatch(getOrganisationByIdAction(orgId)).then(res => {
            firstForm.reset({
                createdAt: getDateFormat(new Date(res.createdAt)),
                name: res.name,
                description: res.description,
            })
            setLimitsType(limitOptions.find(limit => limit.value === res.limitsType))
        })

        dispatch(getFormatModelsAction)

        dispatch(getOrgModelsAction(orgId)).then(res => {
            const resModelIds = new Set(res.map(model => model.modelId))
            secondForm.reset({
                limitsType,
                selectModels: formatModels.filter(model => resModelIds.has(model.value)),
                ...formatOrgLimits,
            })
        })

        dispatch(resetMessageStateAction)
    }, [activeBut])

    useErrorHookForm(activeBut, firstForm, secondForm)

    const onSelectLimit = (newValue) => {
        setLimitsType(newValue)
        dispatch(resetMessageStateAction)
    }
    const onSelectModels = (newValue) => {
        if (newValue.length < orgModels.length) {
            const selectModelsForDelete = orgModels.filter(secondItem =>
                !newValue.some(firstItem => firstItem.value === secondItem.modelId))
            for (let i = 0; i < selectModelsForDelete.length; i++) {
                const payload = {
                    orgId,
                    modelId: selectModelsForDelete[i].modelId,
                    newValue
                }
                dispatch(deleteOrgModelAction(payload))
            }
        } else if (newValue.length > orgModels.length) {
            const selectModelsForAdd = newValue.filter(firstItem =>
                !orgModels.some(secondItem => secondItem.modelId === firstItem.value)
            )
            for (let i = 0; i < selectModelsForAdd.length; i++) {
                const fulModel = allModels.find(item => item.modelId === selectModelsForAdd[i].value)

                const payload = {
                    orgId,
                    body: fulModel
                }
                dispatch(addOrgModelAction(payload)).then(res => {
                    secondForm.reset(prev => ({
                        ...prev,
                        [`rps${res.modelId}`]: res.limit.rps,
                        [`requestsPerWeek${res.modelId}`]: res.limit.requestsPerWeek
                    }))
                })
            }
        }
        dispatch(resetMessageStateAction)

    }
    const onSaveOrgData = async (newOrgData) => {
        const payload = {
            orgId,
            body: newOrgData
        }
        dispatch(updateOrgDataAction(payload)).then(() =>
            dispatch(setAcceptMessageAction("Изменения сохранены"))
        ).catch(error => {
                if (error.status === 409)
                    dispatch(setRejectMessageAction(error.response.detail))
            }
        )
    }
    const onSaveModelLimits = (newValue) => {
        const payload = {
            orgId,
            body: {limitsType: newValue.limitsType.value}
        }
        dispatch(updateOrgLimitTypeAction(payload))

        const tmpValue = {...newValue}
        delete tmpValue["limitsType"]
        delete tmpValue["selectModels"]

        const entries = Object.entries(tmpValue)
        for (let i = 0; i < entries.length; i += 2) {
            const chunk = entries.slice(i, i + 2)
            let modelId
            const trueChunk = chunk.map(([key, value]) => {
                const [newKey, lastChar] = key.match(/^(.*)(.)$/).slice(1)
                modelId = lastChar
                return [newKey, value]
            })
            if (orgModels.find(model => model.modelId === Number(modelId))) {
                const payload = {
                    modelId: Number(modelId),
                    orgId: Number(orgId),
                    body: Object.fromEntries(trueChunk)
                }
                dispatch(updateOrgModelsLimitsAction(payload))
            }
        }
        dispatch(setAcceptMessageAction("Изменения сохранены"))
    }

    return (
        <div className="change-container">
            <DataHeader
                activeBut={activeBut}
                setActiveBut={setActiveBut}
                buttons={["ИНФОРМАЦИЯ", "ЛИМИТ И МОДЕЛИ"]}
                names={["first", "second"]}>
                Изменение данных организации
            </DataHeader>

            <AlarmMsg logo={logo}>{message}</AlarmMsg>

            {activeBut === "first" && (
                <ChangeOrganisationInfo form={firstForm} submitFunction={onSaveOrgData}/>
            )}

            {activeBut === "second" && (
                <ChangeOrganisationModels
                    orgModels={orgModels}
                    form={secondForm}
                    submitFunction={onSaveModelLimits}
                    limitOptions={limitOptions}
                    onSelectModels={onSelectModels}
                    onSelectLimit={onSelectLimit}/>
            )}
        </div>
    )
}