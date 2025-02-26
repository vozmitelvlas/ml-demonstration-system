import DataHeader from "../Headers/DataHeader.jsx";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import DeleteModal from "../../utils/DeleteModal.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import acceptLogo from "../../../assets/accept.svg"
import alarmLogo from "../../../assets/alarm.svg"
import apiClient from "../../utils/axios.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {ChangeOrganisationModelsSchema, changeOrganisationsSchema} from "../../store/formSchema.jsx";
import ChangeOrganisationsInfo from "./ChangeOrganisationsInfo.jsx";
import ChangeOrganisationModels from "./ChangeOrganisationModels.jsx";

const limitOptions = [
    {value: 'ORGANIZATION_LIMITS', label: 'Лимит организации'},
    {value: 'MODEL_LIMITS', label: 'Лимиты модели'},
    {value: 'USER_LIMITS', label: 'Лимиты пользователя'}
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

export default function ChangeOrganisations() {
    const {orgId} = useParams()
    const [activeBut, setActiveBut] = useState("first")
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [displayData, setDisplayData] = useState(orgDataForDisplay)
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)
    const [idModelForDelete, setIdModelForDelete] = useState("")
    const [orgModels, setOrgModels] = useState([])
    const [limitsType, setLimitsType] = useState("")

    const firstForm = useForm({
        resolver: yupResolver(changeOrganisationsSchema)
    })
    const secondForm = useForm({
        resolver: yupResolver(ChangeOrganisationModelsSchema)
    })

    useEffect(() => {
        apiClient.get(`/api/admin/organizations/${orgId}`).then(res => {
            setDisplayData({
                createdAt: getDateFormat(new Date(res.data.createdAt))
            })
            firstForm.reset({
                name: res.data.name,
                description: res.data.description,
            })
            setLimitsType(limitOptions.find(limit => limit.value === res.data.limitsType))
        }).catch(error => {
            console.log(error)
        })

        apiClient.get(`/api/admin/organizations/${orgId}/models`).then(res => {
            const formatModels = {}
            console.log(res.data)
            res.data.forEach(model => {
                formatModels[`rps${model.modelId}`] = model.limit.rps.toString()
                formatModels[`requestsPerWeek${model.modelId}`] = model.limit.requestsPerWeek.toString()
            })

            setOrgModels(res.data)
            secondForm.reset({
                limitsType: limitsType,
                ...formatModels
            })
        }).catch(error => {
            console.log(error)
        })

        apiClient.get(`/api/admin/models`).then(res => {
        })

        setAlarm(null)
    }, [activeBut, isDeletingModel])

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

    const closeDeleteModal = () => {
        setIsDeletingModel(false)
    }
    const onDeleteModelClick = (event) => {
        const tr = event.target.closest("tr")
        setIdModelForDelete(tr.dataset.id)
        setIsDeletingModel(true)
    }
    const onConfirmDeletingModel = async () => {
        try {
            await apiClient.delete(`/api/admin/organizations/${orgId}/models/${idModelForDelete}`)
            setAlarm("Модель успешно удалена из организации")
            setLogo(acceptLogo)
            setIsDeletingModel(false)
        } catch (error) {
            console.log(error)
        }
    }
    const onSaveOrgData = async (newOrgData) => {
        console.log(newOrgData)
        try {
            await apiClient.put(`/api/admin/organizations/${orgId}`, newOrgData)
            setAlarm("Изменения сохранены")
            setLogo(acceptLogo)
        } catch (error) {
            if (error.response?.status === 409) {
                setAlarm("Организация с таким названием уже существует")
                setLogo(alarmLogo)
            }
        }
    }
    const onSaveModelLimits = async (newValue) => {
        console.log(newValue)
        try {
            await apiClient.put(`/api/admin/organizations/${orgId}/limits-type`, {limitsType: newValue.limitsType.value})

            const tmpValue = {...newValue}
            delete tmpValue["limitsType"]

            const entries = Object.entries(tmpValue);
            for (let i = 0; i < entries.length; i += 2) {
                const chunk = entries.slice(i, i + 2);
                let modelId;
                const trueChunk = chunk.map(([key, value]) => {
                    const [newKey, lastChar] = key.match(/^(.*)(.)$/).slice(1)
                    modelId = lastChar
                    return [newKey, value];
                });

                const chunkAsObject = Object.fromEntries(trueChunk);

                await apiClient.put(`/api/admin/organizations/${Number(orgId)}/models/${Number(modelId)}/limit`, chunkAsObject)
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
                buttons={["ИНФОРМАЦИЯ", "МОДЕЛИ"]}
                names={["first", "second"]}>
                Изменение данных организации
            </DataHeader>

            <AlarmMsg logo={logo} alarm={alarm}></AlarmMsg>

            {activeBut === "first" && (
                <ChangeOrganisationsInfo
                    register={firstForm.register}
                    handleSubmit={firstForm.handleSubmit}
                    submitFunction={onSaveOrgData}
                    displayData={displayData}>
                </ChangeOrganisationsInfo>
            )}

            {activeBut === "second" && (
                <ChangeOrganisationModels
                    orgModels={orgModels}
                    register={secondForm.register}
                    handleSubmit={secondForm.handleSubmit}
                    submitFunction={onSaveModelLimits}
                    limitOptions={limitOptions}
                    options={options}
                    onDeleteModelClick={onDeleteModelClick}
                    control={secondForm.control}>
                </ChangeOrganisationModels>
            )}

            <DeleteModal
                open={isDeletingModel}
                onNo={closeDeleteModal}
                onYes={onConfirmDeletingModel}
            ></DeleteModal>
        </div>
    )
}