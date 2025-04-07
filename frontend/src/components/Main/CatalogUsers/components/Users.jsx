import {getDateFormat} from "../../../utils/DateAndTime.jsx";
import {Link} from "react-router-dom";
import editLogo from "../../../../assets/edit.svg";
import deleteLogo from "../../../../assets/delete.svg";
import React from "react";

export function Users({users, onDeleteUserClick}) {
    return(
        <>
            <div className="catalog-users">
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
                            <strong>Организация</strong>
                        </th>
                        <th className="text-center">
                            <strong>Дата регистрации</strong>
                        </th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.userId}
                            data-id={user.userId}>
                            <td className="text-center">
                                <input type="checkbox"/>
                            </td>
                            <td className="text-center">{user.lastName}</td>
                            <td className="text-center">{user.firstName}</td>
                            <td className="text-center">{user.login}</td>
                            <td className="text-center">{user.email}</td>
                            <td className="text-center">{user.organization.name}</td>
                            <td className="text-center">{getDateFormat(new Date(user.createdAt))}</td>
                            <td className="text-center">
                                <Link className="a-img" to={`/users/${user.userId}/edit`}><img
                                    src={editLogo}></img></Link>
                            </td>
                            <td className="text-center">
                                <a className="a-img" onClick={onDeleteUserClick}><img src={deleteLogo}></img></a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}