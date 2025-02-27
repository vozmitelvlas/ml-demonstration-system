import {getDateFormat} from "../../utils/DateAndTime.jsx";
import {Controller} from "react-hook-form";
import Select from "react-select";
import Button from "../Button/Button.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function ChangeUserInfo({
                                           handleSubmit,
                                           submitFunction,
                                           displayData,
                                           register,
                                           control,
                                           orgOptions,
                                           selectStyle,
                                           setFirstMultiBackColor,
                                           setSecondMultiBackColor,
                                           rolesOptions
                                       }) {
    const navigate = useNavigate()
    return (
        <>
            <form onSubmit={handleSubmit(submitFunction)} className="change-content">
                <div>
                    <table className="change-container__table naked-input data-input">
                        <tbody>
                        <tr>
                            <td>Логин</td>
                            <td className="text-center">
                                <input type="text" value={displayData.login} disabled/>
                            </td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td className="text-center">
                                <input type="text" value={displayData.email} disabled/>
                            </td>
                        </tr>
                        <tr>
                            <td>Дата регистрации</td>
                            <td className="text-center">
                                <input type="text" value={getDateFormat(new Date(displayData.createdAt))} disabled/>
                            </td>
                        </tr>
                        <tr>

                            <td>Фамилия</td>
                            <td className="text-center">
                                <input type="text" {...register("lastName")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Имя</td>
                            <td className="text-center">
                                <input type="text" {...register("firstName")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Организация</td>
                            <td>
                                <Controller
                                    control={control}
                                    name="organization"
                                    render={({
                                                 field: {onChange, value},

                                             }) => (
                                        <Select
                                            options={orgOptions}
                                            onChange={onChange}
                                            value={value}
                                            isSearchable
                                            styles={selectStyle}
                                        />
                                    )}/>

                            </td>
                        </tr>
                        <tr onMouseEnter={setFirstMultiBackColor} onMouseLeave={setSecondMultiBackColor}>
                            <td>Роль</td>
                            <td>
                                <Controller
                                    control={control}
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
                                            styles={selectStyle}
                                        />
                                    )}
                                />

                            </td>
                        </tr>
                        <tr>
                            <td>Описание</td>
                            <td>
                                <textarea {...register("description")}></textarea>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="delete-modal__buttons">
                    <Button type="button" onClick={() => {
                        navigate("/users")
                    }}>Назад</Button>
                    <Button type="submit">Сохранить</Button>
                </div>
            </form>
        </>
    )
}