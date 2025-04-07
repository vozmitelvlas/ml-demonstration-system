import CatalogHeader from "../Headers/CatalogHeader/CatalogHeader.jsx";
import Button from "../Buttons/Button.jsx";
import "../Catalog.css"
import "../Table.css"
import React, {useEffect, useState} from "react";
import Filter from "../Filter/Filter.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";
import apiClient from "../../utils/apiClient.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import alarmLogo from "../../../assets/alarm.svg"
import acceptLogo from "../../../assets/accept.svg"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {newOrgSchema} from "../../store/formSchema.jsx";
import {NavigateButtons} from "../Buttons/NavigateButtons.jsx";
import {AddNewOrgModal, Organisations} from "./components/index.js";

export default function CatalogOrganisations() {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [tmpOrgId, setTmpOrgId] = useState("")
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)
    const [isAddingOrg, setIsAddingOrg] = useState(false)
    const {
        handleSubmit,
        register,
        setError,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(newOrgSchema),
        defaultValues: {
            name: "",
            description: "",
        }
    })


    const [orgs, setOrgs] = useState([])
    useEffect(() => {
        apiClient("/api/admin/organizations").then(res => {
            setOrgs(res)
        }).catch(error => {
            console.log(error)
        })
    }, [])

    const firstErrorKey = Object.keys(errors)[0];
    useEffect(() => {
        if (firstErrorKey) {
            setLogo(alarmLogo)
            setAlarm(errors[firstErrorKey].message)
        }
    }, [firstErrorKey])

    const onCloseDeleteModal = () => {
        setIsDeletingModel(false)
    }
    const onDeleteOrgClick = (event) => {
        const tr = event.target.closest("tr")
        setTmpOrgId(tr.dataset.id)
        setIsDeletingModel(true)
        setAlarm(null)
    }

    const onAddNewOrg = async (newValue) => {
        try {
            const res = await apiClient("/api/admin/organizations", 'POST', newValue)
            setOrgs([...orgs, res])

            setIsAddingOrg(!isAddingOrg)
            setLogo(acceptLogo)
            setAlarm("Организация успешно создана")
        } catch (error) {
            if (error.status === 409) {
                setError('form', {type: 'server', message: error.detail})
            } else {
                console.log(error)
            }
        }
    }

    const onConfirmDeletingOrg = async () => {
        try {
            await apiClient(`/api/admin/organizations/${tmpOrgId}`, 'DELETE')
            setOrgs(orgs.filter(org => org.organizationId !== Number(tmpOrgId)))
            setLogo(acceptLogo)
            setAlarm("Организация успешно удалена")
        } catch (error) {
            if (error.status === 409) {
                setLogo(alarmLogo)
                setAlarm("Организация не пуста")
            } else {
                console.log(error)
            }
        }
        setIsDeletingModel(false)
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
                <CatalogHeader title={"Каталог организаций"} searchFields={["Название организации"]}></CatalogHeader>

                <div className="options-buttons_up">
                    <Button onClick={() => {
                        setIsAddingOrg(!isAddingOrg)
                        setAlarm(null)
                    }}>Добавить организацию</Button>
                </div>

                <AlarmMsg logo={logo}>{alarm}</AlarmMsg>

                <Organisations onDeleteOrgClick={onDeleteOrgClick} orgs={orgs}/>

                <NavigateButtons setisOpen={setIsOpen} isOpen={isOpen} isAdminMode={true}/>

                <AddNewOrgModal
                    setAlarm={setAlarm}
                    onAddNewOrg={onAddNewOrg}
                    alarm={alarm}
                    logo={logo}
                    register={register}
                    isAddingOrg={isAddingOrg}
                    setIsAddingOrg={setIsAddingOrg}
                    handleSubmit={handleSubmit}/>

                <DeleteModal
                    open={isDeletingModel}
                    onNo={onCloseDeleteModal}
                    onYes={onConfirmDeletingOrg}>
                </DeleteModal>
            </main>
        </>
    )
}