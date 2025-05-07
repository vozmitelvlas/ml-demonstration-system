import {Controller} from "react-hook-form";
import Select from "react-select";
import Button from "../../../components/Buttons/Button.jsx";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {customStyle, setFirstMultiBackColor, setSecondMultiBackColor} from "../../../utils/selectStyles.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectFormatOgs} from "../../../selectors/org-selector.js";
import {resetMessageStateAction} from "../../../actions/message-actions.js";

export function ChangeUserInfo({submitFunction, form, rolesOptions, onInputFocus}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [orgSelectStyle, setOrgSelectStyle] = useState(customStyle)
    const [rolesSelectStyle, setRolesSelectStyle] = useState(customStyle)
    const orgs = useSelector(selectFormatOgs)
    const toUsers = () => navigate("/users")

    return (
        <form onSubmit={form.handleSubmit(submitFunction)} className="change-content" onFocus={onInputFocus}>
            <div>
                <table className="change-container__table naked-input data-input">
                    <tbody>
                    <tr>
                        <td>Логин</td>
                        <td className="text-center">
                            <input type="text" {...form.register("login")} disabled/>
                        </td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td className="text-center">
                            <input type="text" {...form.register("email")} disabled/>
                        </td>
                    </tr>
                    <tr>
                        <td>Дата регистрации</td>
                        <td className="text-center">
                            <input type="text" {...form.register("createdAt")} disabled/>
                        </td>
                    </tr>
                    <tr>

                        <td>Фамилия</td>
                        <td className="text-center">
                            <input type="text" {...form.register("lastName")}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Имя</td>
                        <td className="text-center">
                            <input type="text" {...form.register("firstName")}/>
                        </td>
                    </tr>
                    <tr onMouseEnter={event => setFirstMultiBackColor(event, setOrgSelectStyle, setRolesSelectStyle)}
                        onMouseLeave={event => setSecondMultiBackColor(event, setOrgSelectStyle, setRolesSelectStyle)}
                        data-name={"first"}>
                        <td>Организация</td>
                        <td>
                            <Controller
                                control={form.control}
                                name="organization"
                                render={({
                                             field: {onChange, value},

                                         }) => (
                                    <Select
                                        options={orgs}
                                        onChange={onChange}
                                        value={value}
                                        isSearchable
                                        styles={orgSelectStyle}
                                    />
                                )}/>

                        </td>
                    </tr>
                    <tr onMouseEnter={event => setFirstMultiBackColor(event, setOrgSelectStyle, setRolesSelectStyle)}
                        onMouseLeave={event => setSecondMultiBackColor(event, setOrgSelectStyle, setRolesSelectStyle)}
                        data-name={"second"}>
                        <td>Роль</td>
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
                                    />
                                )}
                            />

                        </td>
                    </tr>
                    <tr>
                        <td>Описание</td>
                        <td>
                            <textarea {...form.register("description")}></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="delete-modal__buttons">
                <Button type="button" onClick={toUsers}>Назад</Button>
                <Button type="submit">Сохранить</Button>
            </div>
        </form>
    )
}