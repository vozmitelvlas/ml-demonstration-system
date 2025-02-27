import Select from "react-select";
import {customStyle} from "../../utils/selectStyles.jsx";
import deleteLogo from "../../../assets/delete.svg";
import Button from "../Button/Button.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";
import {Controller} from "react-hook-form";

export default function ChangeOrganisationModels({
                                                     handleSubmit,
                                                     register,
                                                     limitOptions,
                                                     onDeleteModelClick,
                                                     orgModels,
                                                     submitFunction,
                                                     control,
                                                     allModels,
                                                     onSelectModels,
                                                     onSelectLimit
                                                 }) {
    const navigate = useNavigate()
    return (
        <>
            <form onSubmit={handleSubmit(submitFunction)} className="change-content">
                <div className="change-orgs-content">
                    <div className="select-container">
                        <div>
                            <h2>Установка лимитов и моделей</h2>
                            <div className="orgs-selects">
                                <Controller
                                    control={control}
                                    name="limitsType"
                                    render={({
                                                 field: {onChange, value},
                                             }) => (
                                        <Select
                                            className="limits-select naked-input"
                                            options={limitOptions}
                                            onChange={(newValue) => {
                                                onChange(newValue)
                                                onSelectLimit(newValue)
                                            }}
                                            value={value}
                                            isSearchable
                                            styles={customStyle}
                                        />
                                    )}/>

                                <Controller
                                    control={control}
                                    name="selectModels"
                                    render={({
                                                 field: {onChange, value},
                                             }) => (
                                        <Select
                                            isMulti
                                            className="limits-select naked-input"
                                            options={allModels}
                                            onChange={(newValue) => {
                                                onChange(newValue)
                                                onSelectModels(newValue)
                                            }}
                                            closeMenuOnSelect={false}
                                            value={value}
                                            isSearchable
                                            styles={customStyle}
                                        />
                                    )}/>
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
                            {orgModels.map(model => (
                                <tr key={model.modelId} data-id={model.modelId}>
                                    <td className="text-center">{model.modelId}</td>
                                    <td className="text-center">{model.modelName}</td>
                                    <td className="text-center">
                                        <input type="text" {...register(`rps${model.modelId}`)} />
                                    </td>
                                    <td className="text-center">
                                        <input type="text" {...register(`requestsPerWeek${model.modelId}`)}/>
                                    </td>
                                    <td className="text-center">
                                        <a className="a-img" onClick={onDeleteModelClick}>
                                            <img src={deleteLogo}></img>
                                        </a>
                                    </td>
                                </tr>
                            ))}
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