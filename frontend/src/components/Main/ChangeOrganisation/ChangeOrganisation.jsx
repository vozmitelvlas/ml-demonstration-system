import DataHeader from "../Headers/DataHeader/DataHeader.jsx";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import acceptLogo from "../../../assets/accept.svg"
import alarmLogo from "../../../assets/alarm.svg"
import apiClient from "../../utils/apiClient.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeOrganisationsSchema, limitsSchema} from "../../store/formSchema.jsx";
import {ChangeOrganisationInfo, ChangeOrganisationModels} from "./components/index.js";

const limitOptions = [
    {value: 'ORGANIZATION_LIMITS', label: 'Лимит организации'},
    {value: 'MODEL_LIMITS', label: 'Лимиты модели'},
    {value: 'USER_LIMITS', label: 'Лимиты пользователя'}
]
const orgDataForDisplay = {
    createdAt: "",
}

export default function ChangeOrganisation() {
    const {orgId} = useParams()
    const [activeBut, setActiveBut] = useState("first")
    const [displayData, setDisplayData] = useState(orgDataForDisplay)
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)
    const [orgModels, setOrgModels] = useState([])
    const [limitsType, setLimitsType] = useState(null)
    const [modelOptions, setModelOptions] = useState([])
    const [allModels, setAllModels] = useState([])

    const firstForm = useForm({
        resolver: yupResolver(changeOrganisationsSchema)
    })
    const secondForm = useForm({
        resolver: yupResolver(limitsSchema)
    })

    useEffect(() => {
        apiClient(`/api/admin/organizations/${orgId}`).then(res => {
            setDisplayData({
                createdAt: getDateFormat(new Date(res.createdAt))
            })
            firstForm.reset({
                name: res.name,
                description: res.description,
            })
            setLimitsType(limitOptions.find(limit => limit.value === res.limitsType))
        }).catch(error => {
            console.log(error)
        })

        apiClient(`/api/admin/models`).then(res => {
            setAllModels(res)
            setModelOptions(
                res.map(model => ({
                    value: model.modelId,
                    label: model.name
                }))
            )
        }).catch(error => {
            console.log(error)
        })

        apiClient(`/api/admin/organizations/${orgId}/models`).then(res => {
            const formatOrgModels = res.reduce((acc, model) => {
                acc[`rps${model.modelId}`] = model.limit.rps.toString()
                acc[`requestsPerWeek${model.modelId}`] = model.limit.requestsPerWeek.toString()
                return acc
            }, {})
            const resModelIds = new Set(res.map(model => model.modelId));

            setOrgModels(res.sort((a, b) => a.modelId - b.modelId))
            secondForm.reset({
                limitsType,
                selectModels: modelOptions.filter(model => resModelIds.has(model.value)),
                ...formatOrgModels,
            })
        }).catch(error => {
            console.log(error)
        })
        setAlarm(null)
    }, [activeBut])

    useEffect(() => {
        if (activeBut === "first") {
            const firstErrorKey1 = Object.keys(firstForm.formState.errors)[0]
            if (firstErrorKey1) {
                setLogo(alarmLogo)
                setAlarm(firstForm.formState.errors[firstErrorKey1].message)
            }
        } else if (activeBut === "second") {
            const firstErrorKey2 = Object.keys(secondForm.formState.errors)[0];
            if (firstErrorKey2 !== undefined) {
                setLogo(alarmLogo)
                setAlarm(secondForm.formState.errors[firstErrorKey2].message)
            }
        }
    }, [firstForm.formState.errors, secondForm.formState.errors])

    const onSelectLimit = (newValue) => {
        setLimitsType(newValue)
        setAlarm(null)
    }
    const onSelectModels = async (newValue) => {
        try {
            if (newValue.length < orgModels.length) {
                const selectModelsForDelete = orgModels.filter(secondItem =>
                    !newValue.some(firstItem => firstItem.value === secondItem.modelId))
                for (let i = 0; i < selectModelsForDelete.length; i++) {
                    await apiClient(`/api/admin/organizations/${orgId}/models/${selectModelsForDelete[i].modelId}`, 'DELETE')

                    setOrgModels(orgModels.filter(secondItem =>
                        newValue.some(firstItem => firstItem.value === secondItem.modelId)))
                }
            } else if (newValue.length > orgModels.length) {
                const selectModelsForAdd = newValue.filter(firstItem =>
                    !orgModels.some(secondItem => secondItem.modelId === firstItem.value)
                )
                for (let i = 0; i < selectModelsForAdd.length; i++) {
                    const fulModel = allModels.find(item => item.modelId === selectModelsForAdd[i].value)
                    const res = await apiClient(`/api/admin/organizations/${orgId}/models`, 'POST', fulModel)

                    setOrgModels(prevState => ([
                        ...prevState,
                        res
                    ]))
                    secondForm.reset(prev => ({
                        ...prev,
                        [`rps${res.modelId}`]: res.limit.rps.toString(),
                        [`requestsPerWeek${res.modelId}`]: res.limit.requestsPerWeek.toString()
                    }))
                }
            }
            setAlarm(null)
        } catch (error) {
            console.log(error)
        }
    }
    const onSaveOrgData = async (newOrgData) => {
        try {
            await apiClient(`/api/admin/organizations/${orgId}`, 'PUT', newOrgData)
            setAlarm("Изменения сохранены")
            setLogo(acceptLogo)
        } catch (error) {
            if (error.status === 409) {
                setAlarm("Организация с таким названием уже существует")
                setLogo(alarmLogo)
            }
        }
    }
    const onSaveModelLimits = async (newValue) => {
        try {
            await apiClient(`/api/admin/organizations/${orgId}/limits-type`, 'PUT', {limitsType: newValue.limitsType.value})

            const tmpValue = {...newValue}
            delete tmpValue["limitsType"]
            delete tmpValue["selectModels"]

            const entries = Object.entries(tmpValue);
            for (let i = 0; i < entries.length; i += 2) {
                const chunk = entries.slice(i, i + 2);
                let modelId;
                const trueChunk = chunk.map(([key, value]) => {
                    const [newKey, lastChar] = key.match(/^(.*)(.)$/).slice(1)
                    modelId = lastChar
                    return [newKey, value]
                });
                if (orgModels.find(model => model.modelId === Number(modelId))) {
                    const chunkAsObject = Object.fromEntries(trueChunk);
                    await apiClient(`/api/admin/organizations/${Number(orgId)}/models/${Number(modelId)}/limit`, 'PUT', chunkAsObject)
                }
            }
            setLogo(acceptLogo)
            setAlarm("Изменения сохранены")
        } catch (error) {
            console.log(error)
        }
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

            <AlarmMsg logo={logo}>{alarm}</AlarmMsg>

            {activeBut === "first" && (
                <ChangeOrganisationInfo
                    register={firstForm.register}
                    handleSubmit={firstForm.handleSubmit}
                    submitFunction={onSaveOrgData}
                    displayData={displayData}>
                </ChangeOrganisationInfo>
            )}

            {activeBut === "second" && (
                <ChangeOrganisationModels
                    orgModels={orgModels}
                    register={secondForm.register}
                    handleSubmit={secondForm.handleSubmit}
                    submitFunction={onSaveModelLimits}
                    limitOptions={limitOptions}
                    control={secondForm.control}
                    allModels={modelOptions}
                    onSelectModels={onSelectModels}
                    onSelectLimit={onSelectLimit}>
                </ChangeOrganisationModels>
            )}
        </div>
    )
}