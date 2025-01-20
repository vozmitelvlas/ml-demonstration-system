import CatalogHeader from "../Headers/CatalogHeader.jsx";
import Button from "../../Button.jsx";
import deleteLogo from "../../../assets/delete.svg";
import editLogo from "../../../assets/edit.svg"
import "../Catalog.css"
import "../CatalogModels/Table.css"
import {useNavigate} from "react-router-dom";

function CatalogUsers() {
    let navigate = useNavigate()


    let modelsCatalog = (event) => {
        navigate("/models")
    }
    let usersGroups = () => {
        navigate("/users/organisations")
    }
    let clickOnTbody = (event) => {
        let deleteRef = event.target.closest('[name="deleteLogo"]')
        let editRef = event.target.closest('[name="editLogo"]')
        if(editRef){
            navigate("/users/edit")
        } else if(deleteRef){

        }
    }
    return (
        <main>
            <CatalogHeader title={"Каталог пользователей"} searchFields={["Логин", "Почта", "Фамилия"]}></CatalogHeader>

            <div className="options-buttons_up">
                <Button>Добавить пользователя</Button>
            </div>

            <div className="catalog-models">
                <table className="table-fill">
                    <thead>
                    <tr>
                        <th className="text-center"></th>
                        <th className="text-center">
                            <strong>Фамилия</strong>
                        </th>
                        <th className="text-center">
                            <strong>Имя</strong>
                        </th>
                        <th className="text-center">
                            <strong>Логин</strong>
                        </th>
                        <th className="text-center">
                            <strong>Почта</strong>
                        </th>
                        <th className="text-center">
                            <strong>Группа</strong>
                        </th>
                        <th className="text-center">
                            <strong>Дата регистрации</strong>
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
                        <td className="text-center">Ivanov</td>
                        <td className="text-center">Ivan</td>
                        <td className="text-center">ivanov_ivan</td>
                        <td className="text-center">ivanovIvan@mail.ru</td>
                        <td className="text-center">Пользователи</td>
                        <td className="text-center">13.01.25</td>
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
                        <td className="text-center">Ivanov</td>
                        <td className="text-center">Ivan</td>
                        <td className="text-center">ivanov_ivan</td>
                        <td className="text-center">ivanovIvan@mail.ru</td>
                        <td className="text-center">Пользователи</td>
                        <td className="text-center">13.01.25</td>
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
                <Button onClick={usersGroups}>Организации</Button>
                <Button onClick={modelsCatalog}>Модели</Button>
            </div>
        </main>
    )
}

export default CatalogUsers