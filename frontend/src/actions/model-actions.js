import apiClient from "../utils/apiClient.jsx";

export const getModelVersionDataAsUserAction = (payload) => (dispatch) =>
    apiClient(`/api/models/versions/${payload.versionId}`).then(res =>
        dispatch({
            type: "SET_MODEL_VERSION_DATA",
            payload: res
        })
    )

export const getModelResultAction = (payload) => (dispatch) =>
    apiClient(`/api/models/${payload.modelId}/user/${payload.userId}`).then(res =>
        dispatch({
            type: "SET_MODEL_RESULT",
            payload: res
        })
    )

export const getRunTimesAction = (dispatch) =>
    apiClient('/api/models/runtimes').then(res =>
        dispatch({
            type: "SET_RUNTIMES",
            payload: res
        })
    )

export const getProblemTypesAction = (dispatch) =>
    apiClient('/api/models/problem-types').then(res => {
            dispatch({
                type: "SET_PROBLEM_TYPES",
                payload: res
            })
        }
    )

export const getModelVersionsAsUserAction =  (dispatch) =>
    apiClient('/api/models/versions').then(res => {
            dispatch({
                type: "SET_MODEL_VERSIONS",
                payload: res
            })
        }
    )