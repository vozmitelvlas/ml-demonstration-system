import CatalogHeader from "../Headers/CatalogHeader/CatalogHeader.jsx";
import "../ModalWindow.css"
import "../select.css"
import React, {useEffect, useState} from "react";
import Filter from "../Filter/Filter.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import {useForm} from "react-hook-form";
import {AddNewModelVersionModal, TopButtons, Models, AddNewModelModal} from "./components/index.js";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {NavigateButtons} from "../Buttons/NavigateButtons.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectUserRoles} from "../../../selectors/user-selector.js";
import {getModelVersionsAsUserAction,} from "../../../actions/model-actions.js";
import {
    addModelAction, addModelVersionAction,
    deleteModelAction, getFormatModelsAction, getModelVersionsAsAdminAction
} from "../../../actions/admin-model-actions.js";
import {logOutAction} from "../../../actions/auth-actions.js";
import {sendEmailConfirmationWithToken} from "../../../actions/user-actions.js";
import {selectMessageState} from "../../../selectors/message-selector.js";
import {
    resetMessageStateAction,
    setAcceptMessageAction,
    setRejectMessageAction
} from "../../../actions/message-actions.js";

export default function CatalogModels({isConfirmed, setIsConfirmed}) {
    const dispatch = useDispatch()
    const {message, logo} = useSelector(selectMessageState)
    const {isAdminMode} = useSelector(selectUserRoles)
    const [isOpen, setIsOpen] = useState(false)
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [tmpModelId, setTmpModelId] = useState([])
    const [isAddingModel, setIsAddingModel] = useState(false)
    const [isAddingVersion, setIsAddingVersion] = useState(false)
    const modelForm = useForm({
        resolver: yupResolver(yup.object()),
        defaultValues: {
            name: "",
            uri: "",
            description: "",
            problemType: "",
            runtime: "",
        }
    })
    const versionForm = useForm({
        resolver: yupResolver(yup.object()),
        defaultValues: {
            selectModel: null,
            versionName: "",
            uri: "",
            description: "",
        }
    })

    useEffect(() => {
        let tokenFromUrl = ""

        async function fetchData() {
            const urlParams = new URLSearchParams(window.location.search)
            tokenFromUrl = urlParams.get('token')
            if (tokenFromUrl && !isConfirmed) {
                await dispatch(logOutAction)
                await dispatch(sendEmailConfirmationWithToken(tokenFromUrl))
                dispatch(setAcceptMessageAction("Адрес электронной почты подтвержден"))
            }
            setIsConfirmed(true)
        }

        fetchData().then(r => {
        })
        if (!tokenFromUrl)
            dispatch(resetMessageStateAction)
    }, [])

    useEffect(() => {
        if (isConfirmed) {
            isAdminMode ? dispatch(getModelVersionsAsAdminAction) : dispatch(getModelVersionsAsUserAction)
        }
    }, [isAdminMode, isConfirmed])

    const firstErrorKey1 = Object.keys(modelForm.formState.errors)[0]
    const firstErrorKey2 = Object.keys(versionForm.formState.errors)[0]
    useEffect(() => {
        if (firstErrorKey1)
            dispatch(setRejectMessageAction(modelForm.formState.errors[firstErrorKey1].message))
        if (firstErrorKey2) {
            dispatch(setRejectMessageAction(versionForm.formState.errors[firstErrorKey2].message))
        }
    }, [firstErrorKey1, firstErrorKey2])

    const closeDeleteModal = () => setIsDeletingModel(false)
    const onDeleteModelClick = (event) => {
        const tr = event.target.closest("tr")
        setTmpModelId(tr.dataset.id.split(" "))
        setIsDeletingModel(true)
        dispatch(resetMessageStateAction)
    }
    const onConfirmDeletingModel = async () => {
        const payload = {
            modelId: tmpModelId[0],
            versionId: tmpModelId[1]
        }
        dispatch(deleteModelAction(payload)).then(() => {
            setIsDeletingModel(false)
            dispatch(getFormatModelsAction)
            dispatch(setAcceptMessageAction("Модель успешно удалена"))
        })
    }
    const onConfirmAddingModel = (newValue) => {
        const payload = {
            ...newValue,
            problemType: newValue.problemType.value,
            runtime: newValue.runtime.value
        }
        dispatch(addModelAction(payload)).then(() => {
            setIsAddingModel(!isAddingModel)
            modelForm.reset()
            dispatch(setAcceptMessageAction("Модель успешно добавлена"))
        }).catch(error => {
            if (error.status === 409)
                modelForm.setError('form', {type: 'server', message: error.detail})
            else if (error.status === 400)
                modelForm.setError('form', {type: 'server', message: error.errors})
        })
    }
    const onConfirmAddingVersion = async (newValue) => {
        const {selectModel, ...formatValues} = newValue
        const modelId = selectModel.value
        const payload = {
            modelId,
            body: formatValues
        }
        dispatch(addModelVersionAction(payload)).then(() => {
            setIsAddingVersion(!isAddingVersion)
            versionForm.reset()
            dispatch(setAcceptMessageAction("Версия модели успешно добавлена"))
        }).catch(error => {
            if (error.status === 409)
                versionForm.setError('version', {type: 'server', message: error.detail})
        })
    }

    return (
        <>
            {isOpen &&
                <Filter
                    setIsOpen={setIsOpen}
                    selects={{
                        "Статус": {
                            options: ["Готово к использованию", "Недоступно"],
                            names: ["ready", "notReady"]
                        },
                        "Тип модели": {
                            options: ["TensorFlow"],
                            names: ["TensorFlow"]
                        },
                    }}
                    sorts={{
                        "Сортировать": {
                            options: ["Последние добавленные", "Давно добавленные"],
                            names: ["latestAdded", "oldestAdded"]
                        },
                    }}/>
            }
            <main>
                <CatalogHeader title={"Каталог моделей"} searchFields={["Название модели", "Тип модели"]}/>

                <TopButtons setIsAddingModel={setIsAddingModel} setIsAddingVersion={setIsAddingVersion}/>

                <AlarmMsg logo={logo}>{message}</AlarmMsg>

                <Models onDeleteModelClick={onDeleteModelClick}/>

                <NavigateButtons setIsOpen={setIsOpen}/>

                <AddNewModelModal
                    isAddingModel={isAddingModel}
                    onAdd={onConfirmAddingModel}
                    form={modelForm}
                    setIsAddingModel={setIsAddingModel}
                    isConfirmed={isConfirmed}/>

                <AddNewModelVersionModal
                    isAddingVersion={isAddingVersion}
                    setIsAddingVersion={setIsAddingVersion}
                    onAdd={onConfirmAddingVersion}
                    form={versionForm}
                    isConfirmed={isConfirmed}/>

                <DeleteModal
                    open={isDeletingModel}
                    onNo={closeDeleteModal}
                    onYes={onConfirmDeletingModel}/>
            </main>
        </>
    )
}