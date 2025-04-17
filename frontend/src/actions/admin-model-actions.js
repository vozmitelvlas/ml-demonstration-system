import apiClient from "../utils/apiClient.jsx";

export const getModelVersionDataAsAdminAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/models/${payload.modelId}/versions/${payload.versionId}`).then((res) => {
        dispatch({
            type: "SET_MODEL_VERSION_DATA",
            payload: res
        })
        return res
    }).catch(error => {
            throw error
        }
    )


export const getModelVersionsAsAdminAction = (dispatch) =>
    apiClient('/api/admin/models/versions').then(res => {
            dispatch({
                type: "SET_MODEL_VERSIONS",
                payload: res
            })
        }
    )

export const getFormatModelsAction = (dispatch) =>
    apiClient('/api/admin/models').then(res => {
            dispatch({
                type: "SET_FORMAT_MODELS",
                payload: res
            })
            dispatch({
                type: "SET_MODELS",
                payload: res
            })
        }
    )

export const deleteModelAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/models/${payload.modelId}/versions/${payload.versionId}`, 'DELETE').then(() => {
            dispatch({
                type: "DELETE_MODEL",
                payload: payload.versionId
            })
        }
    )

export const addModelAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/models`, 'POST', payload).then(res => {
            dispatch({
                type: "ADD_MODEL",
                payload: res
            })
        }
    )

export const addModelVersionAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/models/${payload.modelId}/versions`, 'POST', payload.body).then(res => {
        dispatch({
            type: "ADD_MODEL_VERSION",
            payload: res
        })
    })

export const updateModelData = (payload) => (dispatch) =>
    apiClient(`/api/admin/models/${payload.modelId}/versions/${payload.versionId}`, 'PUT', payload.body)

export const updateModelLimit = (payload) => (dispatch) =>
    apiClient(`/api/admin/models/${payload.modelId}/limit`, 'PUT', payload.body)


