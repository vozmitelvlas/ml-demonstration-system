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
import {customStyle, firstStyle, secondStyle} from "../../utils/selectStyles.jsx";
import apiClient from "../../utils/axios.jsx";
import {getDateFormat} from "../../utils/DateAndTime.jsx";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import alarmLogo from "../../../assets/alarm.svg"
import acceptLogo from "../../../assets/accept.svg"

export default function CatalogOrganisations() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [isDeletingModel, setIsDeletingModel] = useState(false)
    const [selectedValues, setSelectedValues] = useState([])
    const [tmpOrgId, setTmpOrgId] = useState("")
    const [alarm, setAlarm] = useState(null)
    const [logo, setLogo] = useState(alarmLogo)
    const [isAddingOrg, setIsAddingOrg] = useState(false)
    const [newOrgValue, setNewOrgValue] = useState({
        name: "",
        description: "",
    })


    const [organisation, setOrganisation] = useState([])
    useEffect(() => {
        apiClient.get("/api/admin/organizations").then(res => {
            setOrganisation(res.data)
        }).catch(error => {
            console.log(error)
        })
    }, [isDeletingModel, isAddingOrg])

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
    }
    const onAddNewOrg = async (event) => {
        event.preventDefault()
        if(newOrgValue.name.length > 3){
            console.log(newOrgValue)
            try {
                await apiClient.post("/api/admin/organizations", newOrgValue)
                setIsAddingOrg(!isAddingOrg)
                setLogo(acceptLogo)
                setAlarm("Организация успешно создана")
            }catch (error) {
                console.log(error)
            }
        } else{
            setLogo(alarmLogo)
            setAlarm("Неверное название. Должно быть не меньше 4 символов")
        }

    }
    const onConfirmDeletingOrg = async (event) => {
        event.preventDefault()
        try {
            await apiClient.delete(`/api/admin/organizations/${tmpOrgId}`)
            setLogo(acceptLogo)
            setAlarm("Организация успешно удалена")
        } catch (error) {
            if (error.response?.status === 409) {
                setLogo(alarmLogo)
                setAlarm("Организация не пуста")
            } else {
                console.log(error)
            }
        }
        setIsDeletingModel(false)
    }
    const onNewChange = ({target}) => {
        setNewOrgValue({...newOrgValue, [target.name]: target.value})
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
                    <Button onClick={()=> {
                        setIsAddingOrg(!isAddingOrg)
                        setAlarm(null)
                    }}>Добавить организацию</Button>
                </div>

                <AlarmMsg logo={logo} alarm={alarm}></AlarmMsg>
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
                        {organisation.map(org => (
                            <tr key={org.organizationId} data-id={org.organizationId}>
                                <td className="text-center">{org.organizationId}</td>
                                <td className="text-center">{org.name}</td>
                                <td className="text-center">{getDateFormat(new Date(org.createdAt))}</td>
                                <td className="text-center">
                                    <Link className="a-img" to={`/organisations/${org.organizationId}/edit`}><img
                                        src={editLogo}></img></Link>
                                </td>
                                <td className="text-center">
                                    <a className="a-img" onClick={onDeleteOrgClick}><img src={deleteLogo}></img></a>
                                </td>
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
                    <form onSubmit={onAddNewOrg} className="new-org__container">
                        <div className="add-modal__title">
                            <h3>Новая организация</h3>
                        </div>
                        <AlarmMsg logo={logo} alarm={alarm}></AlarmMsg>
                        <div className="add-modal__table">
                            <table className="change-container__table naked-input">
                                <tbody>
                                <tr>
                                    <td>Название<span> *</span></td>
                                    <td className="text-center">
                                        <input
                                            name="name"
                                            type="text"
                                            value={newOrgValue.name}
                                            onChange={onNewChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Описание</td>
                                    <td>
                                        <textarea
                                            name="description"
                                            value={newOrgValue.description}
                                            onChange={onNewChange}>

                                        </textarea>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="delete-modal__buttons">
                                <Button type="button" onClick={() => setIsAddingOrg(!isAddingOrg)}>Отмена</Button>
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