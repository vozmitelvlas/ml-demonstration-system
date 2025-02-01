import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../../Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import {useNavigate} from "react-router-dom";
import "../Catalog.css"
import "../CatalogModels/Table.css"
import {useState} from "react";
import Filter from "../Filter/Filter.jsx";

function CatalogOrganisations() {
    let navigate = useNavigate()

    let usersCatalog = (event) => {
        navigate("/users")
    }
    let clickOnTbody = (event) => {
        let deleteRef = event.target.closest('[name="deleteLogo"]')
        let editRef = event.target.closest('[name="editLogo"]')

        if (editRef) {
            console.log("asd")
            navigate("/users/organisations/edit")
        } else if (deleteRef) {
        }
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
                    sorts={{
                        "Сортировать": {
                            options: ["Последние добавленные", "Давно добавленные"],
                            names: ["latestAdded", "oldestAdded"]
                        },
                    }}></Filter>
            }
            <main>
                <CatalogHeader title={"Организации"} searchFields={["Название организации"]}></CatalogHeader>

                <div className="options-buttons_up">
                    <Button>Добавить организацию</Button>
                </div>

                <div className="catalog-orgs">
                    <table className="table-fill table-organisation">
                        <thead>
                        <tr>
                            <th></th>
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
                        <tbody onClick={clickOnTbody}>
                        <tr>
                            <td className="text-center">
                                <input type="checkbox"/>
                            </td>
                            <td className="text-center">Пользователи</td>
                            <td className="text-center">12.31.23</td>
                            <td className="text-center">
                                <a><img name="editLogo" className="a-img" src={editLogo}></img></a>
                            </td>
                            <td className="text-center">
                                <a name="deleteLogo" className="a-img"><img src={deleteLogo}></img></a>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">
                                <input type="checkbox"/>
                            </td>
                            <td className="text-center">Администраторы</td>
                            <td className="text-center">12.31.23</td>
                            <td className="text-center">
                                <a><img name="editLogo" className="a-img" src={editLogo}></img></a>
                            </td>
                            <td className="text-center">
                                <a name="deleteLogo" className="a-img"><img src={deleteLogo}></img></a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="options-buttons">
                    <Button classNames={"filter-button"} onClick={toggleSidebar}>Фильтр</Button>
                    <div className="options-buttons_right-down">
                        <Button>Мониторинг</Button>
                        <Button onClick={usersCatalog}>Пользователи</Button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CatalogOrganisations