import {getDateFormat} from "../../../utils/DateAndTime.jsx";
import {Link} from "react-router-dom";
import editLogo from "../../../../assets/edit.svg";
import deleteLogo from "../../../../assets/delete.svg";
import React from "react";

export function Organisations({orgs, onDeleteOrgClick}) {
    return(
        <>
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
                    {orgs.map(org => (
                        <tr key={org.organizationId} data-id={org.organizationId}>
                            <td className="text-center">{org.organizationId}</td>
                            <td className="text-center">{org.name}</td>
                            <td className="text-center">{getDateFormat(new Date(org.createdAt))}</td>
                            <td className="text-center">
                                <Link className="a-img" to={`/organisations/${org.organizationId}/edit`}>
                                    <img src={editLogo}></img>
                                </Link>
                            </td>
                            {org.editable ? (
                                <>
                                    <td className="text-center">
                                        <a className="a-img" onClick={onDeleteOrgClick}><img src={deleteLogo}></img></a>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td></td>
                                    <td></td>
                                </>
                            )}
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>
        </>
    )
}