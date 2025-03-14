import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";
import Button from "../Button/Button.jsx";
import React, {useState} from "react";
import {Controller} from "react-hook-form";
import Select from "react-select";
import {customStyle, setFirstMultiBackColor, setSecondMultiBackColor} from "../../utils/selectStyles.jsx";

const rolesOptions = [
    {value: 'ADMIN', label: 'Администратор'},
    {value: 'ORGANIZATION_HEAD', label: 'Руководитель организации'},
    {value: 'USER', label: 'Пользователь'},
]

export default function AddNewUserModal({isAddingUser, submitFunction, alarm, logo, onCancel, form, orgOptions}) {
    const [orgSelectStyle, setOrgSelectStyle] = useState(customStyle)
    const [rolesSelectStyle, setRolesSelectStyle] = useState(customStyle)

    return (
            <div className={`add-modal-overlay ${isAddingUser ? "" : "add-modal-overlay_hidden"}`}>
                <form onSubmit={form.handleSubmit(submitFunction)} className="add-container">
                    <div className="add-modal__title">
                        <h3>Новый пользователь</h3>
                    </div>
                    <AlarmMsg logo={logo}>{alarm}</AlarmMsg>
                    <div className="add-modal__table">
                        <table className="change-container__table naked-input data-input">
                            <tbody>
                            <tr>
                                <td>E-mail<span> *</span></td>
                                <td className="text-center">
                                    <input type="text" {...form.register("email")} required/>
                                </td>
                            </tr>
                            <tr>
                                <td>Логин<span> *</span></td>
                                <td className="text-center">
                                    <input type="text" {...form.register("login")} required/>
                                </td>
                            </tr>
                            <tr>
                                <td>Фамилия<span> *</span></td>
                                <td className="text-center">
                                    <input type="text" {...form.register("lastName")} required/>
                                </td>
                            </tr>
                            <tr>
                                <td>Имя<span> *</span></td>
                                <td className="text-center">
                                    <input type="text" {...form.register("firstName")} required/>
                                </td>
                            </tr>
                            <tr>
                                <td>Отчество</td>
                                <td className="text-center">
                                    <input type="text" {...form.register("patronymic")}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Пароль<span> *</span></td>
                                <td className="text-center">
                                    <input type="password" {...form.register("password")} required/>
                                </td>
                            </tr>
                            <tr onMouseEnter={event => setFirstMultiBackColor(event, setOrgSelectStyle, setRolesSelectStyle)}
                                onMouseLeave={event => setSecondMultiBackColor(event, setOrgSelectStyle, setRolesSelectStyle)}
                                data-name={"first"}>
                                <td>Организация<span> *</span></td>
                                <td>
                                    <Controller
                                        control={form.control}
                                        name="organization"
                                        render={({
                                                     field: {onChange, value},

                                                 }) => (
                                            <Select
                                                options={orgOptions}
                                                onChange={onChange}
                                                value={value}
                                                isSearchable
                                                styles={orgSelectStyle}
                                                required
                                            />
                                        )}/>

                                </td>
                            </tr>
                            <tr onMouseEnter={event => setFirstMultiBackColor(event, setOrgSelectStyle, setRolesSelectStyle)}
                                onMouseLeave={event => setSecondMultiBackColor(event, setOrgSelectStyle, setRolesSelectStyle)}
                                data-name={"second"}>
                                <td>Роль<span> *</span></td>
                                <td>
                                    <Controller
                                        control={form.control}
                                        name="selectRoles"
                                        render={({
                                                     field: {onChange, value}
                                                 }) => (
                                            <Select
                                                isMulti
                                                options={rolesOptions}
                                                onChange={onChange}
                                                value={value}
                                                closeMenuOnSelect={false}
                                                isSearchable
                                                styles={rolesSelectStyle}
                                                required
                                            />
                                        )}
                                    />

                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="add-user__buttons">
                        <Button type="button" onClick={onCancel}>Отмена</Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </form>
            </div>
    )
}