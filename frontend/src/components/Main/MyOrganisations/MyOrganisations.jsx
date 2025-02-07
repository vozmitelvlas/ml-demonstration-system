import Filter from "../Filter/Filter.jsx";
import {useState} from "react";
import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../Button/Button.jsx";
import editLogo from "../../../assets/edit.svg";
import deleteLogo from "../../../assets/delete.svg";
import {Link, useNavigate} from "react-router-dom";

export default function MyOrganisations(){
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    let onEditOrg = () => {
        navigate("/user/organisations/edit")
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
                <CatalogHeader title={"Мои организации"} searchFields={["Название организации"]}></CatalogHeader>

                <div className="catalog-orgs">
                    <table className="table-fill table-organisation">
                        <thead>
                        <tr>
                            <th className="text-center">
                                <strong>Название</strong>
                            </th>
                            <th className="text-center">
                                <strong>Дата создания</strong>
                            </th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="text-center">Пользователи</td>
                            <td className="text-center">12.31.23</td>
                            <td className="text-center">
                                <Link className="a-img" to={`/user/organisations/${1}/edit`}><img src={editLogo}></img></Link>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">Администраторы</td>
                            <td className="text-center">12.31.23</td>
                            <td className="text-center">
                                <a><img name="editLogo" className="a-img" src={editLogo}></img></a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="options-buttons">
                    <Button classNames="filter-button" onClick={toggleSidebar}>Фильтр</Button>
                </div>
            </main>
        </>
    )
}