import CatalogHeader from "../../components/Headers/CatalogHeader/CatalogHeader.jsx";
import Button from "../../components/Buttons/Button.jsx";
import "../../components/Catalog.css"
import "../../components/Table.css"
import React, {useEffect, useState} from "react";
import Filter from "../../components/Filter/Filter.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";
import {AlarmMsg} from "../../components/AlarmMsg/AlarmMsg.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {newOrgSchema} from "../../store/formSchema.jsx";
import {NavigateButtons} from "../../components/Buttons/NavigateButtons.jsx";
import {AddNewOrgModal, Organisations} from "./components/index.js";
import {useDispatch, useSelector} from "react-redux";
import {addNewOrgAction, deleteOrgAction, getOrganisationsAction} from "../../actions/admin-org-actions.js";
import {
    resetMessageStateAction, setAcceptMessageAction, setRejectMessageAction
} from "../../actions/message-actions.js";
import {selectMessageState} from "../../selectors/message-selector.js";

export default function CatalogOrganisations() {
    const dispatch = useDispatch()
    const {message, logo} = useSelector(selectMessageState)
    const [isOpen, setIsOpen] = useState(false)
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [tmpOrgId, setTmpOrgId] = useState("")
    const [isAddingOrg, setIsAddingOrg] = useState(false)
    const orgForm = useForm({
        resolver: yupResolver(newOrgSchema),
        defaultValues: {
            name: "",
            description: "",
        }
    })

    useEffect(() => {
        dispatch(resetMessageStateAction)
        dispatch(getOrganisationsAction)
    }, [])

    const firstErrorKey = Object.keys(orgForm.formState.errors)[0]
    useEffect(() => {
        if (firstErrorKey)
            dispatch(setRejectMessageAction(orgForm.formState.errors[firstErrorKey].message))
    }, [firstErrorKey])

    const onCloseDeleteModal = () => setIsDeletingModel(false)

    const onDeleteOrgClick = (event) => {
        const tr = event.target.closest("tr")
        setTmpOrgId(tr.dataset.id)
        setIsDeletingModel(true)
        dispatch(resetMessageStateAction)
    }

    const onAddNewOrg = (newValue) => {
        dispatch(addNewOrgAction(newValue)).then(() => {
            dispatch(setAcceptMessageAction("Организация успешно создана"))
            setIsAddingOrg(!isAddingOrg)
            orgForm.reset()
        }).catch(error => {
            if (error.status === 409)
                orgForm.setError('form', {type: 'server', message: error.detail})
        })
    }

    const onConfirmDeletingOrg = () => {
        dispatch(deleteOrgAction(tmpOrgId)).then(() =>
            dispatch(setAcceptMessageAction("Организация успешно удалена"))
        ).catch(error => {
            if (error.status === 409)
                dispatch(setRejectMessageAction(error.detail))
        }).finally(() =>
            setIsDeletingModel(false)
        )
    }
    const onAddOrgButton = () => {
        setIsAddingOrg(!isAddingOrg)
        dispatch(resetMessageStateAction)
    }

    return (
        <>
            {isOpen &&
                <Filter
                    setIsOpen={setIsOpen}
                    sorts={{
                        "Сортировать": {
                            options: ["Последние добавленные", "Давно добавленные"],
                            names: ["latestAdded", "oldestAdded"]
                        },
                    }}></Filter>
            }
            <main>
                <CatalogHeader title={"Каталог организаций"} searchFields={["Название организации"]}/>

                <div className="options-buttons_up">
                    <Button onClick={onAddOrgButton}>Добавить организацию</Button>
                </div>

                <AlarmMsg logo={logo}>{message}</AlarmMsg>

                <Organisations onDeleteOrgClick={onDeleteOrgClick}/>

                <NavigateButtons setIsOpen={setIsOpen}/>

                <AddNewOrgModal
                    onAddNewOrg={onAddNewOrg}
                    isAddingOrg={isAddingOrg}
                    setIsAddingOrg={setIsAddingOrg}
                    form={orgForm}
                />

                <DeleteModal
                    open={isDeletingModel}
                    onNo={onCloseDeleteModal}
                    onYes={onConfirmDeletingOrg}/>
            </main>
        </>
    )
}