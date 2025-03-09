import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../Button/Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import {Link, useNavigate} from "react-router-dom";
import "../Catalog.css"
import "../Table.css"
import React, {useEffect, useState} from "react";
import Filter from "../Filter/Filter.jsx";
import DeleteModal from "../../utils/DeleteModal.jsx";
import apiClient from "../../utils/apiClient.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import alarmLogo from "../../../assets/alarm.svg"
import acceptLogo from "../../../assets/accept.svg"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {newOrgSchema} from "../../store/formSchema.jsx";

export default function CatalogOrganisations() {
    const navigate = useNavigate()
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

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }
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
                <div className="catalog-orgs">
                    <table className="table-fill table-organisation">
                        <thead>
                        <tr>
                            <th className="text-center">
                                <strong>ID</strong>
                            </th>
                            <th className="text-center">
                                <strong>Название</strong>
                            </th>
                            <th className="text-center">
                                <strong>Дата создания</strong>
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {orgs.map(org => (
                            <tr key={org.organizationId} data-id={org.organizationId}>
                                <td className="text-center">{org.organizationId}</td>
                                <td className="text-center">{org.name}</td>
                                <td className="text-center">{getDateFormat(new Date(org.createdAt))}</td>
                                {org.editable ? (
                                    <>
                                        <td className="text-center">
                                            <Link className="a-img" to={`/organisations/${org.organizationId}/edit`}><img
                                                src={editLogo}></img></Link>
                                        </td>
                                        <td className="text-center">
                                            <a className="a-img" onClick={onDeleteOrgClick}><img src={deleteLogo}></img></a>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td></td>
                                        <td></td>
                                    </>
                                )}
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </div>

                <div className="options-buttons">
                    <Button classNames="filter-button" onClick={toggleSidebar}>Фильтр</Button>
                    <div className="options-buttons_right-down">
                        <Button onClick={() => {
                            navigate("/models")
                        }}>Модели</Button>
                        <Button onClick={() => {
                            navigate("/users")
                        }}>Пользователи</Button>
                        <Button onClick={() => {
                            navigate("/organisations")
                        }}>Организации</Button>
                    </div>
                </div>

                <div className={`add-modal-overlay ${isAddingOrg ? "" : "add-modal-overlay_hidden"}`}>
                    <form onSubmit={handleSubmit(onAddNewOrg)} className="add-container">
                        <div className="add-modal__title">
                            <h3>Новая организация</h3>
                        </div>
                        <AlarmMsg logo={logo}>{alarm}</AlarmMsg>
                        <div className="add-modal__table">
                            <table className="change-container__table naked-input data-input">
                                <tbody>
                                <tr>
                                    <td>Название<span> *</span></td>
                                    <td className="text-center">
                                        <input type="text" {...register("name")}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Описание</td>
                                    <td>
                                        <textarea {...register("description")}></textarea>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="delete-modal__buttons">
                                <Button type="button" onClick={() => {
                                    setIsAddingOrg(!isAddingOrg)
                                    setAlarm(null)
                                }}>Отмена</Button>
                                <Button type="submit">Добавить</Button>
                            </div>
                        </div>
                    </form>
                </div>

                <DeleteModal
                    open={isDeletingModel}
                    onNo={onCloseDeleteModal}
                    onYes={onConfirmDeletingOrg}>
                </DeleteModal>
            </main>
        </>
    )
}