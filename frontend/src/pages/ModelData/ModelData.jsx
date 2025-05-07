import DataHeader from "../../components/Headers/DataHeader/DataHeader.jsx";
import Button from "../../components/Buttons/Button.jsx";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ModelData.module.css"
import { useInterval } from "../../hooks/useInterval.js";
import { useDispatch, useSelector } from "react-redux";
import { selectUserRoles } from "../../selectors/user-selector.js";
import { selectModelVersionData } from "../../selectors/model-selectors.js";
import { getTaskResult, getTaskStatus, performInferenceAction } from "../../actions/inference-actions.js";
import { getModelVersionDataAsAdminAction } from "../../actions/admin-model-actions.js";
import { getModelVersionDataAsUserAction } from "../../actions/model-actions.js";
import { resetMessageStateAction, setRejectMessageAction } from "../../actions/message-actions.js";
import { selectMessageState } from "../../selectors/message-selector.js";
import { AlarmMsg } from "../../components/AlarmMsg/AlarmMsg.jsx";


export default function ModelData() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { modelId, versionId } = useParams()
    const { isAdmin } = useSelector(selectUserRoles)
    const { message, logo } = useSelector(selectMessageState)
    const modelVersionData = useSelector(selectModelVersionData)
    const [activeBut, setActiveBut] = useState("first")
    const [inferenceInput, setInferenceInput] = useState(null);
    const [inferenceResult, setInferenceResult] = useState(null)
    const [taskId, setTaskId] = useState(null);

    useEffect(() => {
        const payload = { modelId, versionId }
        dispatch(resetMessageStateAction)
        if (isAdmin)
            dispatch(getModelVersionDataAsAdminAction(payload))
        else
            dispatch(getModelVersionDataAsUserAction(payload))
    }, [activeBut, isAdmin])


    useInterval(() => {
        if (taskId) {
            getTaskStatus(taskId)
                .then(task => {
                    if (task.status === "SUCCEED") {
                        setInferenceResult(task);
                        setTaskId(null);
                    }
                })
                .catch(error => {
                    console.error(error);
                    dispatch(setRejectMessageAction(error.errorDescription));
                    setTaskId(null);
                });
        }
    }, taskId ? 5000 : null);

    const onRunInference = () => {
        setInferenceResult(null)
        const inferRequest = {
            modelVersionId: versionId,
        }

        const payload = {
            inferRequest,
            file: inferenceInput
        }
        dispatch(performInferenceAction(payload)).then(async (taskId) => {
            dispatch(resetMessageStateAction)
            setTaskId(taskId)
        }).catch(error => {
            console.error(error)
            if (error.status === 404) {
                dispatch(setRejectMessageAction("Ваша организация не имеет доступа к модели"))
            }
            else { dispatch(setRejectMessageAction(error.detail)) }
        })
    }

    const downloadInferenceResult = async (taskId) => {
        getTaskResult(taskId).then(({blob, filename}) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);   
        })
        .catch((error) => dispatch(setRejectMessageAction(error.detail)))
        
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
                                <p>Поддерживаемые форматы: DICOM, ZIP</p>
                                <input type="file" id="file" onChange={e => setInferenceInput(e.target.files[0])} required />
                            </div>
                        </div>

                        <button className={styles.sendButton} onClick={onRunInference}>Отправить</button>
                        {taskId && (
                            <p>Не переключайтесь на другую страницу. Ожидайте результат инференса</p>
                        )}
                        {inferenceResult && (<>
                            <p>Время инференса: {inferenceResult?.executionTime}</p>
                            <button
                                className={styles.sendButton}
                                onClick={() => downloadInferenceResult(inferenceResult?.taskId)}
                            >
                                Скачать результат
                            </button>                        </>
                        )}

                    </div>
                    <div className={styles.backButton}>
                        <Button onClick={() => {
                            navigate("/models")
                        }}>Назад</Button>
                    </div>
                </div>
            )
            }
        </div >
    )
}