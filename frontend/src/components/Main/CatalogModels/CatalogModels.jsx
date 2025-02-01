import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../../Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import copyLogo from "../../../assets/copy.svg"
import acceptLogo from "../../../assets/accept.svg"
import rejectLogo from "../../../assets/reject.svg"
import {Link, useNavigate} from "react-router-dom";
import "../Catalog.css"
import "./Table.css"
import "../../ModalWindow.css"
import "../../select.css"
import Input from "../../Input.jsx";
import {useState} from "react";
import Filter from "../Filter/Filter.jsx";

function CatalogModels({isAdminMode}) {
    let navigate = useNavigate()

    let closeModal = (event) => {
        event.preventDefault()

        if (event.target.closest(".delete-modal")) {
            let modalWindow = document.querySelector(".delete-modal-overlay");
            modalWindow.classList.add("delete-modal-overlay_hidden");
        } else if (event.target.closest(".add-modal")) {
            let addModal = document.querySelector(".add-modal-overlay")
            addModal.classList.add("add-modal-overlay_hidden")
        }
    }
    let openAddModal = (event) => {
        let addModal = document.querySelector(".add-modal-overlay")
        addModal.classList.remove("add-modal-overlay_hidden")
    }
    let clickOnTbody = (event) => {
        let deleteRef = event.target.closest('[name="deleteLogo"]')
        let editRef = event.target.closest('[name="editLogo"]')
        let copyRef = event.target.closest('[name="copyLogo"]')

        let tr = event.target.closest("tr")
        if (deleteRef) {
            let deleteModal = document.querySelector(".delete-modal-overlay")
            deleteModal.classList.remove("delete-modal-overlay_hidden")
        } else if (editRef) {
            navigate(`/models/${tr.id}/edit`)
        } else if (copyRef) {
            console.log("copy")
        }
    }
    let handleNewModelClick = (event) => {
        event.preventDefault()
        navigate("models/edit")
    }
    let usersCatalog = (event) => {
        navigate("/users")
    }

    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

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
                    }}></Filter>
            }
            <main>
                <CatalogHeader title={"Каталог моделей"}
                               searchFields={["Название модели", "Тип модели"]}></CatalogHeader>

                {isAdminMode && (
                    <div className="options-buttons_up">
                        <Button onClick={openAddModal}>Добавить модель</Button>
                        <Button>Импорт</Button>
                        <Button>Экспорт</Button>
                    </div>
                )}

                <div className="catalog-models">
                    <table className="table-fill">
                        <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">Статус</th>
                            <th className="text-center">Название</th>
                            <th className="text-center">Версия</th>
                            <th className="text-center">Тип модели</th>
                            <th className="text-center">Дата добавления</th>
                            <th className="text-center">URL модели</th>
                            {isAdminMode && (
                                <th></th>
                            )}
                            {isAdminMode && (
                                <th></th>
                            )}
                        </tr>
                        </thead>
                        <tbody onClick={clickOnTbody}>
                        <tr id="123">
                            <td className="text-center">1</td>
                            <td className="text-center">
                                <a><img src={acceptLogo}></img></a>
                            </td>
                            <td className="text-center"><Link to={"/models/${1}/data"}>Graph-based segmentation
                                model</Link>
                            </td>
                            <td className="text-center">#1</td>
                            <td className="text-center">type</td>
                            <td className="text-center">123123</td>
                            <td className="text-center">
                                <div className="URL">
                                    dfpmpdmfpbpm/a/a/
                                    <a className="a-img" name="copyLogo"><img src={copyLogo}></img></a>
                                </div>
                            </td>
                            {isAdminMode && (
                                <td className="text-center">
                                    <Link className="a-img" to={`/models/${1}/edit`}><img src={editLogo}></img></Link>
                                </td>
                            )}
                            {isAdminMode && (
                                <td className="text-center">
                                    <a className="a-img" name="deleteLogo"><img src={deleteLogo}></img></a>
                                </td>
                            )}
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="options-buttons">
                    <Button classNames="filter-button" onClick={toggleSidebar}>Фильтр</Button>
                    {isAdminMode && (
                        <div className="options-buttons_right-down">
                            <Button>Мониторинг</Button>
                            <Button onClick={usersCatalog}>Пользователи</Button>
                        </div>
                    )}
                </div>


                <div className="add-modal-overlay add-modal-overlay_hidden">
                    <div className="add-modal">
                        <div className="add-modal__title">
                            <h3>Новая модель</h3>
                        </div>

                        <form className="add-modal__form">
                            <div className="add-modal__inputs">
                                <Input placeholder={"Название"} classNames="modal-input"></Input>
                                <Input placeholder={"Название образа модели"} classNames="modal-input"></Input>
                            </div>
                            <div>
                                <p>Тип задачи</p>
                                <select>
                                    <option value="default">Тип</option>
                                    <option value="new">first</option>
                                    <option value="old">second</option>
                                </select>
                            </div>

                            <div className="add-modal__buttons">
                                <Button type="submit" onClick={closeModal}>Отмена</Button>
                                <Button type="submit" onClick={handleNewModelClick}>Добавить</Button>
                                <span className="edit-error-msg"></span>
                            </div>

                        </form>

                    </div>
                </div>

                <div className="delete-modal-overlay delete-modal-overlay_hidden">
                    <div className="delete-modal">
                        <div className="add-modal__title">
                            <h3>
                                Вы действительно хотите удалить эту модель?
                            </h3>
                        </div>

                        <div className="delete-modal__buttons">
                            <Button onClick={closeModal}>Нет</Button>
                            <Button>Да</Button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CatalogModels