import apiClient from "../components/utils/apiClient.jsx";

export const getUsersAction = (dispatch) =>
    apiClient('/api/admin/users').then(res =>
        dispatch({
            type: "SET_USERS",
            payload: res
        })
    )

export const deleteUserByIdAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/users/${payload}`, "DELETE").then(() => {
            dispatch({
                type: "DELETE_USER",
                payload: payload
            })
        }
    )

export const addUserAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/users`, "POST", payload).then(res => {
        dispatch({
            type: "ADD_USER",
            payload: res
        })
    })

export const changeUserAccessAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/users/${payload.id}/active`, 'PUT', payload.body).then(() =>
        dispatch({
            type: "CHANGE_USER_ACCESS",
            payload: {
                ...payload,
                active: payload.body.isActive
            }
        })
    )

export const getUserDataAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/users/${payload}`).then(res => {
            dispatch({
                type: "SET_USER_FOR_ADMIN",
                payload: res
            })
            return res
        }
    ).catch(error => {
        throw error
    })

export const getUserLimitsAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/users/${payload}/limits`).then(res => {
        dispatch({
            type: "SET_USER_LIMITS",
            payload: res
        })
    })

export const updateUserDataAsAdminAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/users/${payload.userId}`, 'PUT', payload.body).then(() => {
    })

export const updateUserLimits = (payload) => (dispatch) =>
    apiClient(`/api/admin/users/${Number(payload.userId)}/models/${Number(payload.modelId)}/limit`, 'PUT', payload.body)