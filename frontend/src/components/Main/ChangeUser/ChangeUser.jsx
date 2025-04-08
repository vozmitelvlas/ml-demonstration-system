import DataHeader from "../Headers/DataHeader/DataHeader.jsx";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import alarmLogo from "../../../assets/alarm.svg";
import acceptLogo from "../../../assets/accept.svg";
import apiClient from "../../utils/apiClient.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeUserDataSchema, limitsSchema} from "../../store/formSchema.jsx";
import {ChangeUserInfo, ChangeUserLimits} from "./components/index.js";

const rolesOptions = [
    {value: 'ADMIN', label: 'Администратор'},
    {value: 'ORGANIZATION_HEAD', label: 'Руководитель организации'},
    {value: 'USER', label: 'Пользователь'},
]
const userDataForDisplay = {
    login: "",
    email: "",
    createdAt: "",
}

export default function ChangeUser() {
    const {userId} = useParams()
    const [activeBut, setActiveBut] = useState("first")
    const [displayData, setDisplayData] = useState(userDataForDisplay)
    const [logo, setLogo] = useState(alarmLogo)
    const [alarm, setAlarm] = useState(null)
    const [orgOptions, setOrgOptions] = useState([])
    const [userData, setUserData] = useState({})
    const [userLimits, setUserLimits] = useState([])

    const firstForm = useForm({
        resolver: yupResolver(changeUserDataSchema)
    })
    const secondForm = useForm({
        resolver: yupResolver(limitsSchema)
    })


    useEffect(() => {
        apiClient(`/api/admin/organizations`).then((res) => {
            const organisations = []
            res.forEach(org => {
                organisations.push({value: org.organizationId, label: org.name})
            })
            setOrgOptions(organisations)
        }).catch(error => {
            console.log(error)
        })
        apiClient(`/api/admin/users/${userId}`).then((res) => {
            const dataForEdit = {
                lastName: res.lastName,
                firstName: res.firstName,
                patronymic: res.patronymic,
                description: res.description,
                organization: {value: res.organization.organizationId, label: res.organization.name},
                selectRoles: rolesOptions.filter(role => res.roles.includes(role.value))
            }
            const dataForDisplay = {
                login: res.login,
                email: res.email,
                createdAt: res.createdAt,
            }

            setUserData(res)
            setDisplayData(dataForDisplay)
            firstForm.reset(dataForEdit)
        }).catch(error => {
            console.log(error)
        })
    }, [])
    useEffect(() => {
        apiClient(`/api/admin/users/${userId}/limits`).then(res => {
            setUserLimits(res)
            const formatOrgModels = {}
            res.sort((a, b) => a.modelId - b.modelId).forEach(model => {
                    formatOrgModels[`rps${model.modelId}`] = model.limit.rps
                    formatOrgModels[`requestsPerWeek${model.modelId}`] = model.limit.requestsPerWeek
                }
            );
            secondForm.reset({...formatOrgModels})
        })
        setAlarm(null)
    }, [activeBut]);


    useEffect(() => {
        if (activeBut === "first") {
            const firstErrorKey1 = Object.keys(firstForm.formState.errors)[0]
            if (firstErrorKey1) {
                setLogo(alarmLogo)
                setAlarm(firstForm.formState.errors[firstErrorKey1].message)
            }
        } else if (activeBut === "second") {
            const firstErrorKey2 = Object.keys(secondForm.formState.errors)[0]
            if (firstErrorKey2 !== undefined) {
                setLogo(alarmLogo)
                setAlarm(secondForm.formState.errors[firstErrorKey2].message)
            }
        }
    }, [firstForm.formState.errors, secondForm.formState.errors])

    const onInputChange = (newValue) => {
        setAlarm(null)
    }
    const onSaveUserData = async (newUserData) => {
        const allSendData = {
            ...newUserData,
            organizationId: newUserData.organization.value,
            roles: newUserData["selectRoles"].map(role => role.value)
        }

        try {
            const res = await apiClient(`/api/admin/users/${userId}`, 'PUT', allSendData)

            setUserData(res)
            setLogo(acceptLogo)
            setAlarm('Изменения сохранены')
        } catch (error) {
            console.error(error)
        }
    }
    const onSaveUserLimit = async (newValue) => {
        try {
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

                await apiClient(`/api/admin/users/${Number(userId)}/models/${Number(modelId)}/limit`, 'PUT',chunkAsObject)
            }
            setLogo(acceptLogo)
            setAlarm("Изменения сохранены")
        }catch (error){
            console.log(error)
        }
    }

    return (
        <div className="change-container">

            <DataHeader activeBut={activeBut}
                        setActiveBut={setActiveBut}
                        buttons={["ИНФОРМАЦИЯ", "ЛИМИТ И МОДЕЛИ"]}
                        names={["first", "second"]}>
                Изменение данных пользователя
            </DataHeader>

            <AlarmMsg logo={logo}>{alarm}</AlarmMsg>

            {activeBut === "first" && (
                <ChangeUserInfo
                    control={firstForm.control}
                    handleSubmit={firstForm.handleSubmit}
                    register={firstForm.register}
                    submitFunction={onSaveUserData}
                    displayData={displayData}
                    orgOptions={orgOptions}
                    rolesOptions={rolesOptions}
                ></ChangeUserInfo>
            )}
            {activeBut === "second" && (
                <ChangeUserLimits
                    register={secondForm.register}
                    handleSubmit={secondForm.handleSubmit}
                    userLimits={userLimits}
                    submitFunction={onSaveUserLimit}
                    onInputChange={onInputChange}
                ></ChangeUserLimits>
            )}
        </div>

    )

}