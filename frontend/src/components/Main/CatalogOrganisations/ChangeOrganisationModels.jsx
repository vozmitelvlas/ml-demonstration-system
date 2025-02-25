import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";
import deleteLogo from "../../../assets/delete.svg";
import Button from "../Button/Button.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function ChangeOrganisationModels({handleSubmit, register, limitOptions, options, onDeleteModelClick}) {
    const navigate = useNavigate()
    return (
        <>
            <form className="change-content">
                <div className="change-orgs-content">
                    <div className="select-container">
                        <div>
                            <h2>Установка лимитов и моделей</h2>
                            <div className="orgs-selects">
                                <Select
                                    className="limits-select naked-input"
                                    options={limitOptions}
                                    // onChange={handleSelectChange}
                                    placeholder="Лимит"
                                    isSearchable
                                    styles={customStyle}
                                />
                                <Select
                                    className="limits-select naked-input"
                                    isMulti
                                    options={options}
                                    // onChange={handleSelectChange}
                                    closeMenuOnSelect={false}
                                    placeholder="Модели"
                                    isSearchable
                                    styles={customStyle}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="orgs-models">
                        <h2>Доступные организации модели</h2>
                        <table className="table-fill naked-input limits-input">
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
                <div className="delete-modal__buttons">
                    <Button type="button" onClick={() => {
                        navigate("/organisations")
                    }}>Назад</Button>
                    <Button type="submit">Сохранить</Button>
                </div>
            </form>
        </>
    )
}