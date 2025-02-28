import React, {useEffect, useState} from "react";
import "../ChangeData.css"
import Button from "../Button/Button.jsx";
import DataHeader from "../Headers/DataHeader.jsx";
import {useNavigate, useParams} from "react-router-dom";
import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";
import acceptLogo from "../../../assets/accept.svg"
import alarmLogo from "../../../assets/alarm.svg"
import apiClient from "../../utils/axios.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeModelDataSchema, limitsSchema} from "../../store/formSchema.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx"
import {ChangeModelInfo} from "./ChangeModelInfo.jsx";
import ChangeModelLimit from "./ChangeModelLimit.jsx";

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

    const firstForm = useForm({
        resolver: yupResolver(changeModelDataSchema)
    })
    const secondForm = useForm({
        resolver: yupResolver(limitsSchema),
        defaultValues: {
            rps: "",
            requestsPerWeek: ""
        }
    })

    useEffect(() => {
        apiClient.get(`/api/admin/models/${modelId}/versions/${versionId}`).then((res) => {
            const dataForEdit = {
                modelName: res.data.modelName,
                versionName: res.data.versionName,
                description: res.data.description,
                uri: res.data.uri,
                runtime: res.data.runtime,
                problemType: res.data.problemType,
            }
            const dataForDisplay = {
                modelId: res.data.modelId,
                status: "ok",
                createdAt: res.data.createdAt,
            }
            const limitData = {
                rps: res.data.limit.rps,
                requestsPerWeek: res.data.limit.requestsPerWeek
            }

            setModelData(res.data)
            setDisplayData(dataForDisplay)

            firstForm.reset(dataForEdit)
            secondForm.reset(limitData)
        }).catch(error => {
            console.log(error)
        })
        setAlarm(null)
    }, [activeBut]);

    useEffect(() => {
        if (activeBut === "first") {
            const firstErrorKey1 = Object.keys(firstForm.formState.errors)[0];
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
    }, [firstForm.formState.errors, secondForm.formState.errors]);

    const onChangeName = () => {
        setLogo(alarmLogo)
        setAlarm('Названия других версий данной модели также изменятся')
    }
    const onBlurName = () => {
        setAlarm(null)
    }
    const onSaveModelData = async (newModelData) => {
        try {
            await apiClient.put(`/api/admin/models/${modelId}/versions/${versionId}`, newModelData);
            setLogo(acceptLogo)
            setAlarm('Изменения сохранены')
        } catch (error) {
            console.error(error);
        }
    }
    const onSaveModelLimit = async (newValue) => {
        try{
            await apiClient.put(`/api/admin/models/${modelId}/limit`, newValue)
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
                    onChangeName={onChangeName}
                    onBlurName={onBlurName}
                    handleSubmit={firstForm.handleSubmit}
                    register={firstForm.register}
                    submitFunction={onSaveModelData}
                    displayData={displayData}
                ></ChangeModelInfo>
            )}

            {activeBut === "second" && (
                <ChangeModelLimit
                    register={secondForm.register}
                    handleSubmit={secondForm.handleSubmit}
                    submitFunction={onSaveModelLimit}
                ></ChangeModelLimit>
            )}
        </div>
    )
}