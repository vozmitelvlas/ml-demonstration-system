import DataHeader from "../Headers/DataHeader/DataHeader.jsx";
import Button from "../Buttons/Button.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styles from "./ModelData.module.css"
import {useDispatch, useSelector} from "react-redux";
import {selectUserData, selectUserRoles} from "../../../selectors/user-selector.js";
import {selectModelVersionData} from "../../../selectors/model-selectors.js";
import {getModelVersionDataAsAdminAction} from "../../../actions/admin-model-actions.js";
import {getModelResultAction, getModelVersionDataAsUserAction} from "../../../actions/model-actions.js";
import {resetMessageStateAction, setRejectMessageAction} from "../../../actions/message-actions.js";
import {selectMessageState} from "../../../selectors/message-selector.js";
import {AlarmMsg} from "../AlarmMsg/AlarmMsg.jsx";


export default function ModelData() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {modelId, versionId} = useParams()
    const {userId} = useSelector(selectUserData)
    const {isAdmin} = useSelector(selectUserRoles)
    const {message, logo} = useSelector(selectMessageState)
    const modelVersionData = useSelector(selectModelVersionData)
    const [activeBut, setActiveBut] = useState("first")

    useEffect(() => {
        const payload = {modelId, versionId}
        dispatch(resetMessageStateAction)
        if (isAdmin)
            dispatch(getModelVersionDataAsAdminAction(payload))
        else
            dispatch(getModelVersionDataAsUserAction(payload))
    }, [activeBut, isAdmin])

    const onTestRPSLimit = () => {
        const payload = {modelId, userId}
        dispatch(getModelResultAction(payload)).catch(error => {
            if (error.status === 429) {
                dispatch(setRejectMessageAction(error.detail))
            }
        })
    }

    return (
        <div className="change-container">

            <DataHeader activeBut={activeBut}
                        setActiveBut={setActiveBut}
                        buttons={["ИНФОРМАЦИЯ", "ВИЗУАЛИЗАЦИЯ"]}
                        names={["first", "second"]}>
                {modelVersionData.modelName}
            </DataHeader>
            <AlarmMsg logo={logo}>{message}</AlarmMsg>

            {activeBut === "first" && (
                <div className="change-content">
                    <div>
                        <table className="change-container__table naked-input">
                            <tbody>
                            <tr>
                                <td>ID</td>
                                <td className="text-center">{modelVersionData.modelId}</td>
                            </tr>
                            <tr>
                                <td>Название</td>
                                <td className="text-center">{modelVersionData.modelName}</td>
                            </tr>
                            <tr>
                                <td>Версия</td>
                                <td className="text-center">{modelVersionData.versionName}</td>
                            </tr>
                            <tr>
                                <td>Статус</td>
                                <td className="text-center">ok</td>
                            </tr>
                            <tr>
                                <td>RunTime</td>
                                <td className="text-center">{modelVersionData.runtime?.value}</td>
                            </tr>
                            <tr>
                                <td>Тип задачи</td>
                                <td className="text-center">{modelVersionData.problemType?.value}</td>
                            </tr>
                            <tr>
                                <td>URI модели</td>
                                <td className="text-center">{modelVersionData.uri}</td>
                            </tr>
                            <tr>
                                <td>Описание</td>
                                <td>
                                    <textarea value={modelVersionData.description} disabled></textarea>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.backButton}>
                        <Button onClick={() => {
                            navigate("/models")
                        }}>Назад</Button>
                    </div>
                </div>
            )}

            {activeBut === "second" && (
                <div className="change-content">
                    <div className="download">
                        <div className={styles.upload}>
                            <div className={styles.uploadContainer}>
                                <i className="fa fa-cloud-upload"></i>
                                <h3>Загрузите данные для модели</h3>
                                <p>Поддерживаемые форматы: PNG, JPEG, BMP</p>
                                <input type="file" id="file"/>
                            </div>
                        </div>

                        <button className={styles.sendButton} onClick={onTestRPSLimit}>Отправить1</button>
                    </div>
                    <div className={styles.backButton}>
                        <Button onClick={() => {
                            navigate("/models")
                        }}>Назад</Button>
                    </div>
                </div>
            )}
        </div>
    )
}