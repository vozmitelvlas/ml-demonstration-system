import DataHeader from "../Headers/DataHeader.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {customStyle, firstStyle, secondStyle} from "../../utils/selectStyles.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import alarmLogo from "../../../assets/alarm.svg";
import acceptLogo from "../../../assets/accept.svg";
import apiClient from "../../utils/axios.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeUserDataSchema, limitsSchema} from "../../store/formSchema.jsx";
import ChangeUserInfo from "./ChangeUserInfo.jsx";
import ChangeUserLimits from "./ChangeUserLimits.jsx";

const rolesOptions = [
    {value: 'ADMIN', label: 'Администратор'},
    {value: 'ORGANIZATION_HEAD', label: 'Руководитель организации'},
    {value: 'USER', label: 'Пользователь'},
];
const userDataForDisplay = {
    login: "",
    email: "",
    createdAt: "",
}

export default function ChangeUser() {
    const {userId} = useParams()
    const [activeBut, setActiveBut] = useState("first");
    const [displayData, setDisplayData] = useState(userDataForDisplay)
    const [logo, setLogo] = useState(alarmLogo)
    const [alarm, setAlarm] = useState(null)
    const [orgOptions, setOrgOptions] = useState([])
    const [selectStyle, setSelectStyles] = useState(customStyle);
    const [userData, setUserData] = useState({})
    const [userLimits, setUserLimits] = useState([])

    const firstForm = useForm({
        resolver: yupResolver(changeUserDataSchema)
    })
    const secondForm = useForm({
        resolver: yupResolver(limitsSchema)
    })


    useEffect(() => {
        apiClient.get(`/api/admin/organizations`).then((res) => {
            let organisations = []
            res.data.forEach(org => {
                organisations.push({value: org.organizationId, label: org.name})
            })
            setOrgOptions(organisations)
        }).catch(error => {
            console.log(error)
        })

        apiClient.get(`/api/admin/users/${userId}`).then((res) => {
            const dataForEdit = {
                lastName: res.data.lastName,
                firstName: res.data.firstName,
                patronymic: res.data.patronymic,
                description: res.data.description,
                organization: {value: res.data.organization.organizationId, label: res.data.organization.name},
                selectRoles: rolesOptions.filter(role => res.data.roles.includes(role.value))
            }
            const dataForDisplay = {
                login: res.data.login,
                email: res.data.email,
                createdAt: res.data.createdAt,
            }

            setUserData(res.data)
            setDisplayData(dataForDisplay)
            firstForm.reset(dataForEdit)
        }).catch(error => {
            console.log(error)
        })

        apiClient.get(`/api/admin/users/${userId}/limits`).then(res => {
            console.log(res.data)
            setUserLimits(res.data)
            const formatOrgModels = {}
            res.data.sort((a, b) => a.modelId - b.modelId).forEach(model => {
                    console.log()
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

    const onInputChange = (newValue) => {
        setAlarm(null)
    }
    const setFirstMultiBackColor = () => {
        setSelectStyles((prev) => firstStyle(prev));
    };
    const setSecondMultiBackColor = () => {
        setSelectStyles((prev) => secondStyle(prev));
    }
    const onSaveUserData = async (newUserData) => {
        console.log(newUserData)
        newUserData["organizationId"] = newUserData.organization.value
        newUserData["roles"] = newUserData["selectRoles"].map(role => role.value)

        try {
            const res = await apiClient.put(`/api/admin/users/${userId}`, newUserData);

            setUserData(res.data)
            setLogo(acceptLogo)
            setAlarm('Изменения сохранены')
        } catch (error) {
            console.error(error);
        }
    }
    const onSaveUserLimit = async (newValue) => {
        console.log(newValue)
        try {
            const entries = Object.entries(newValue);
            for (let i = 0; i < entries.length; i += 2) {
                const chunk = entries.slice(i, i + 2);
                let modelId;
                const trueChunk = chunk.map(([key, value]) => {
                    const [newKey, lastChar] = key.match(/^(.*)(.)$/).slice(1)
                    modelId = lastChar
                    return [newKey, value];
                });

                const chunkAsObject = Object.fromEntries(trueChunk);
                console.log(userId, modelId)

                await apiClient.put(`/api/admin/users/${Number(userId)}/models/${Number(modelId)}/limit`, chunkAsObject)
            }
            setLogo(acceptLogo)
            setAlarm("Изменения сохранены")
        }catch (error){

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

            <AlarmMsg logo={logo} alarm={alarm}></AlarmMsg>

            {activeBut === "first" && (
                <ChangeUserInfo
                    control={firstForm.control}
                    handleSubmit={firstForm.handleSubmit}
                    register={firstForm.register}
                    submitFunction={onSaveUserData}
                    displayData={displayData}
                    orgOptions={orgOptions}
                    selectStyle={selectStyle}
                    rolesOptions={rolesOptions}
                    setFirstMultiBackColor={setFirstMultiBackColor}
                    setSecondMultiBackColor={setSecondMultiBackColor}
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