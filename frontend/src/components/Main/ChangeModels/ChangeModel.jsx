import React, {useEffect, useState} from "react";
import "../ChangeData.css"
import DataHeader from "../Headers/DataHeader/DataHeader.jsx";
import {useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changeModelDataSchema, limitsSchema} from "../../store/formSchema.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx"
import {ChangeModelInfo, ChangeModelLimit} from "./components/index.js";
import {useDispatch, useSelector} from "react-redux";
import {
    getModelVersionDataAsAdminAction,
    updateModelData,
    updateModelLimit
} from "../../../actions/admin-model-actions.js";
import {
    resetMessageStateAction,
    setAcceptMessageAction,
    setRejectMessageAction
} from "../../../actions/message-actions.js";
import {selectMessageState} from "../../../selectors/message-selector.js";
import {useErrorHookForm} from "../../../hooks/error-hooks.js";

export default function ChangeModel() {
    const [activeBut, setActiveBut] = useState("first")
    const {modelId, versionId} = useParams()
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

    const dispatch = useDispatch()
    const {message, logo} = useSelector(selectMessageState)

    useEffect(() => {
        const payload = {modelId, versionId}
        if (activeBut === "first")
            dispatch(getModelVersionDataAsAdminAction(payload)).then(res => {
                infoForm.reset({
                    ...res,
                    runtime: {value: res.runtime.name, label: res.runtime.value},
                    problemType: {value: res.problemType.name, label: res.problemType.value}
                })
                limitForm.reset({
                    ...res.limit
                })
            })
        dispatch(resetMessageStateAction)
    }, [activeBut])

    useErrorHookForm(activeBut, infoForm, limitForm)

    const onChangeName = () => dispatch(setRejectMessageAction('Названия других версий данной модели также изменятся'))

    const onBlurName = () => dispatch(resetMessageStateAction)
    const onSaveModelData = (newModelData) => {
        const payload = {
            modelId,
            versionId,
            body: {
                ...newModelData,
                problemType: newModelData.problemType.value,
                runtime: newModelData.runtime.value
            }
        }
        dispatch(updateModelData(payload)).then(() =>
            dispatch(setAcceptMessageAction('Изменения сохранены'))
        )
    }
    const onSaveModelLimit = (newValue) => {
        const payload = {
            modelId,
            body: newValue
        }
        dispatch(updateModelLimit(payload)).then(() =>
            dispatch(setAcceptMessageAction("Лимиты успешно сохранены"))
        )
    }
    const onInputFocus = (event) => {
        if (event.target.tagName === "INPUT")
            dispatch(resetMessageStateAction)
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

            <AlarmMsg logo={logo}>{message}</AlarmMsg>

            {activeBut === "first" && (
                <ChangeModelInfo
                    onChangeName={onChangeName}
                    onBlurName={onBlurName}
                    form={infoForm}
                    submitFunction={onSaveModelData}
                    onInputFocus={onInputFocus}
                />
            )}

            {activeBut === "second" && (
                <ChangeModelLimit form={limitForm} submitFunction={onSaveModelLimit} onInputFocus={onInputFocus}/>
            )}
        </div>
    )
}