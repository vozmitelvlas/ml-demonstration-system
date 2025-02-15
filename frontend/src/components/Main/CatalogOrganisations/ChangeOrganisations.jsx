import DataHeader from "../Headers/DataHeader.jsx";
import React, {useState} from "react";
import Button from "../Button/Button.jsx";
import {useNavigate} from "react-router-dom";
import deleteLogo from "../../../assets/delete.svg";
import DeleteModal from "../../utils/DeleteModal.jsx";
import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";

const limitOptions = [
    {value: 'O1', label: 'Лимит организации'},
    {value: 'O2', label: 'Лимиты модели'},
    {value: 'O2', label: 'Лимиты пользователя'}
];

const options = [
    {value: 'O1', label: 'First'},
    {value: 'O2', label: 'Second'},
    {value: 'O3', label: 'First'},
    {value: 'O4', label: 'Second'},
    {value: 'O5', label: 'First'},
    {value: 'O6', label: 'Second'},
];

export default function ChangeOrganisations() {
    let navigate = useNavigate()
    const [activeBut, setActiveBut] = useState("first");
    let [isDeletingModel, setIsDeletingModel] = useState(false)

    let closeDeleteModal = () => {
        setIsDeletingModel(false)
    }
    let onDeleteModelClick = (event) => {
        let tr = event.target.closest("tr")
        setIsDeletingModel(true)
    }

    return (
        <div className="change-container">
            <div>
                <DataHeader
                    activeBut={activeBut}
                    setActiveBut={setActiveBut}
                    firstButton="ИНФОРМАЦИЯ"
                    secondButton="МОДЕЛИ">
                    Изменение данных организации
                </DataHeader>

                {activeBut === "first" && (
                    <div>
                        <table className="change-container__table tableHover naked-input">
                            <tbody>
                            <tr>
                                <td>Название</td>
                                <td className="text-center"><input type="text" defaultValue={""}/></td>
                            </tr>
                            <tr>
                                <td>Дата создания</td>
                                <td className="text-center"><input type="text" defaultValue={""} disabled/></td>
                            </tr>
                            <tr>
                                <td>Описание</td>
                                <td><textarea defaultValue={"ADASAlasdair"}></textarea></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeBut === "second" && (
                    <div className="second">
                        <div>
                            <h2>Установка лимитов и моделей</h2>
                            <div className="selects">
                                <Select
                                    className="limits-select naked-input"
                                    options={limitOptions}
                                    // onChange={handleSelectChange}
                                    closeMenuOnSelect={false}
                                    placeholder={"Лимит"}
                                    isSearchable
                                    styles={customStyle}
                                />
                                <Select
                                    className="limits-select naked-input"
                                    isMulti
                                    options={options}
                                    // onChange={handleSelectChange}
                                    closeMenuOnSelect={false}
                                    placeholder={"Модели"}
                                    isSearchable
                                    styles={customStyle}
                                />
                            </div>
                        </div>
                        <div>
                            <h2>Доступные организации модели</h2>
                            <table className="change-container__table tableHover naked-input">
                                <thead>
                                <tr>
                                    <th className="text-center">
                                        <strong>ID</strong>
                                    </th>
                                    <th className="text-center">
                                        <strong>Название</strong>
                                    </th>
                                    <th className="text-center">
                                        <strong>Лимит RPS</strong>
                                    </th>
                                    <th className="text-center">
                                        <strong>Лимит запросов/нед</strong>
                                    </th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="text-center">1</td>
                                    <td className="text-center">Graph-based segmentation model1</td>
                                    <td className="text-center"><input type="text" defaultValue={""}/>
                                    </td>
                                    <td className="text-center"><input type="text" defaultValue={""}/></td>
                                    <td className="text-center">
                                        <a className="a-img" onClick={onDeleteModelClick}><img
                                            src={deleteLogo}></img></a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="delete-modal__buttons">
                <Button onClick={() => {
                    navigate("/organisations")
                }}>Назад</Button>
                <Button>Сохранить</Button>
            </div>

            <DeleteModal open={isDeletingModel} onNo={closeDeleteModal}></DeleteModal>
        </div>
    )
}