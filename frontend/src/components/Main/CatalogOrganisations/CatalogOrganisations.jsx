import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../../Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import {useNavigate} from "react-router-dom";
import "../Catalog.css"
import "../CatalogModels/Table.css"

function CatalogOrganisations() {
    let navigate = useNavigate()

    let usersCatalog = (event) => {
        navigate("/users")
    }
    let clickOnTbody = (event) => {
        let deleteRef = event.target.closest('[name="deleteLogo"]')
        let editRef = event.target.closest('[name="editLogo"]')

        if(editRef){
            console.log("asd")
            navigate("/users/organisations/edit")
        } else if(deleteRef){

        }
    }

    return (
        <main>
            <CatalogHeader title={"Организации"} searchFields={["Название организации"]}></CatalogHeader>

            <div className="options-buttons_up">
                <Button>Добавить организацию</Button>
            </div>

            <div className="catalog-models">
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

            <div className="options-buttons_down">
                <Button>Мониторинг</Button>
                <Button onClick={usersCatalog}>Пользователи</Button>
            </div>
        </main>
    )
}

export default CatalogOrganisations