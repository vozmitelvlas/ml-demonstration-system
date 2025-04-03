import React, {useEffect, useState} from "react";
import "../ChangeData.css"
import DataHeader from "../Headers/DataHeader/DataHeader.jsx";
import {useParams} from "react-router-dom";
import acceptLogo from "../../../assets/accept.svg"
import alarmLogo from "../../../assets/alarm.svg"
import apiClient from "../../utils/apiClient.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeModelDataSchema, limitsSchema} from "../../store/formSchema.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx"
import {ChangeModelInfo} from "./ChangeModelInfo.jsx";
import ChangeModelLimit from "./ChangeModelLimit.jsx";
import {useRequestGetProblemTypes, useRequestGetRunTimes} from "./hooks/index.js";

const modelDataForDisplay = {
    modelId: "",
    status: "ok",
    createdAt: "",
}

export default function ChangeModel() {
    const [activeBut, setActiveBut] = useState("first")
    const [alarm, setAlarm] = useState(null)
    const {modelId, versionId} = useParams()
    const [logo, setLogo] = useState(alarmLogo)
    const [modelData, setModelData] = useState({})
    const [displayData, setDisplayData] = useState(modelDataForDisplay)
    const infoForm = useForm({
        resolver: yupResolver(changeModelDataSchema)
    })
    const limitForm = useForm({
        resolver: yupResolver(limitsSchema),
        defaultValues: {
            rps: "",
            requestsPerWeek: ""
        }
    })

    useEffect(() => {
        apiClient(`/api/admin/models/${modelId}/versions/${versionId}`).then(res => {
            const dataForEdit = {
                modelName: res.modelName,
                versionName: res.versionName,
                description: res.description,
                uri: res.uri,
                runtime: {value: res.runtime.name, label: res.runtime.value},
                problemType: {value: res.problemType.name, label: res.problemType.value}
            }
            const dataForDisplay = {
                modelId: res.modelId,
                status: "ok",
                createdAt: res.createdAt,
            }
            const limitData = {
                rps: res.limit.rps,
                requestsPerWeek: res.limit.requestsPerWeek
            }

            setModelData(res)
            setDisplayData(dataForDisplay)

            infoForm.reset(dataForEdit)
            limitForm.reset(limitData)
        }).catch(error => {
            console.log(error)
        })

        setAlarm(null)
    }, [activeBut])

    useEffect(() => {
        if (activeBut === "first") {
            const firstErrorKey1 = Object.keys(infoForm.formState.errors)[0];
            if (firstErrorKey1) {
                setLogo(alarmLogo)
                setAlarm(infoForm.formState.errors[firstErrorKey1].message)
            }
        } else if (activeBut === "second") {
            const firstErrorKey2 = Object.keys(limitForm.formState.errors)[0];
            if (firstErrorKey2 !== undefined) {
                setLogo(alarmLogo)
                setAlarm(limitForm.formState.errors[firstErrorKey2].message)
            }
        }
    }, [infoForm.formState.errors, limitForm.formState.errors])

    const {runtimes} = useRequestGetRunTimes()
    const {problemTypes} = useRequestGetProblemTypes()

    const onChangeName = () => {
        setLogo(alarmLogo)
        setAlarm('Названия других версий данной модели также изменятся')
    }
    const onBlurName = () => {
        setAlarm(null)
    }
    const onSaveModelData = async (newModelData) => {
        const formatValues = {
            ...newModelData,
            problemType: newModelData.problemType.value,
            runtime: newModelData.runtime.value
        }
        try {
            await apiClient(`/api/admin/models/${modelId}/versions/${versionId}`, 'PUT', formatValues)
            setLogo(acceptLogo)
            setAlarm('Изменения сохранены')
        } catch (error) {
            console.error(error);
        }
    }
    const onSaveModelLimit = async (newValue) => {
        try{
            await apiClient(`/api/admin/models/${modelId}/limit`, 'PUT', newValue)
            setLogo(acceptLogo)
            setAlarm("Лимиты успешно сохранены")
        } catch (error){
            console.log(error)
        }
    }

    return (
        <div className="change-container">
            <DataHeader
                activeBut={activeBut}
                setActiveBut={setActiveBut}
                buttons={["ИНФОРМАЦИЯ", "ЛИМИТ"]}
                names={["first", "second"]}>
                Изменение данных модели
            </DataHeader>

            <AlarmMsg logo={logo}>{alarm}</AlarmMsg>

            {activeBut === "first" && (
                <ChangeModelInfo
                    runtimes={runtimes}
                    problemTypes={problemTypes}
                    onChangeName={onChangeName}
                    onBlurName={onBlurName}
                    form={infoForm}
                    submitFunction={onSaveModelData}
                    displayData={displayData}
                ></ChangeModelInfo>
            )}

            {activeBut === "second" && (
                <ChangeModelLimit
                    form={limitForm}
                    submitFunction={onSaveModelLimit}
                ></ChangeModelLimit>
            )}
        </div>
    )
}