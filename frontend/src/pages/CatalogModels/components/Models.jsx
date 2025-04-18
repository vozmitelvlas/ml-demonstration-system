import acceptLogo from "../../../assets/accept.svg";
import {Link} from "react-router-dom";
import {getDateFormat} from "../../../utils/DateAndTime.jsx";
import copyLogo from "../../../assets/copy.svg";
import editLogo from "../../../assets/edit.svg";
import deleteLogo from "../../../assets/delete.svg";
import React from "react";
import {useSelector} from "react-redux";
import {selectUserRoles} from "../../../selectors/user-selector.js";
import {selectModelVersions} from "../../../selectors/model-selectors.js";

export function Models({onDeleteModelClick}){
    const {isAdminMode} = useSelector(selectUserRoles)
    const modelVersions = useSelector(selectModelVersions)

    return(
        <>
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
                        <th className="text-center">URI модели</th>
                        {isAdminMode && (
                            <th></th>
                        )}
                        {isAdminMode && (
                            <th></th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {modelVersions.map(model => (
                        <tr key={`${model.modelId}${model.modelVersionId}`}
                            data-id={`${model.modelId} ${model.modelVersionId}`}>

                            <td className="text-center">{model.modelVersionId}</td>
                            <td className="text-center">
                                <a><img src={acceptLogo} className="status-img"></img></a>
                            </td>
                            <td className="text-center">
                                <Link
                                    className="custom-link"
                                    to={`/models/${model.modelId}/versions/${model.modelVersionId}/data`}>
                                    {model.modelName}
                                </Link>
                            </td>
                            <td className="text-center">{model.versionName}</td>
                            <td className="text-center">{model.problemType.value}</td>
                            <td className="text-center">{getDateFormat(new Date(model.createdAt))}</td>
                            <td className="text-center">
                                <div className="URL">
                                    {model.uri}
                                    <a className="a-img" name="copyLogo"><img src={copyLogo}></img></a>
                                </div>
                            </td>
                            {isAdminMode && (
                                <td className="text-center">
                                    <Link className="a-img"
                                          to={`/models/${model.modelId}/versions/${model.modelVersionId}/edit`}>
                                        <img src={editLogo}></img>
                                    </Link>
                                </td>
                            )}
                            {isAdminMode && (
                                <td className="text-center">
                                    <a className="a-img" onClick={onDeleteModelClick}>
                                        <img src={deleteLogo}></img>
                                    </a>
                                </td>
                            )}

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}