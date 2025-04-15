import apiClient from "../components/utils/apiClient.jsx";

export const getFormatOrganisationsAction = (dispatch) => {
    apiClient(`/api/admin/organizations`).then(res => {
        dispatch({
            type: "SET_FORMAT_ORGANISATIONS",
            payload: res
        })
    })
}

export const getOrganisationsAction = (dispatch) => {
    apiClient("/api/admin/organizations").then(res =>
        dispatch({
            type: "SET_ORGANISATIONS",
            payload: res
        })
    )
}

export const addNewOrgAction = (payload) => (dispatch) =>
    apiClient("/api/admin/organizations", 'POST', payload).then(res => {
            dispatch({
                type: "ADD_ORG",
                payload: res
            })
        }
    )

export const deleteOrgAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/organizations/${payload}`, 'DELETE').then(() => {
            dispatch({
                type: "DELETE_ORG",
                payload: payload
            })
        }
    )

export const getOrganisationByIdAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/organizations/${payload}`).then(res => {
            dispatch({
                type: "SET_ORG_FOR_ADMIN",
                payload: res
            })
            return res
        }
    ).catch(error => {
        throw error
    })

export const getOrgModelsAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/organizations/${payload}/models`).then(res => {
            dispatch({
                type: "SET_ORG_MODELS",
                payload: res
            })
            dispatch({
                type: "SET_ORG_LIMITS",
                payload: res
            })
            return res
        }
    )

export const deleteOrgModelAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/organizations/${payload.orgId}/models/${payload.modelId}`, 'DELETE').then(() =>
        dispatch({
            type: "DELETE_ORG_MODEL",
            payload: payload.newValue
        })
    )

export const addOrgModelAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/organizations/${payload.orgId}/models`, 'POST', payload.body).then(res => {
            dispatch({
                type: "ADD_ORG_MODEL",
                payload: res
            })
            return res
        }
    ).catch(error => {
        throw error
    })

export const updateOrgDataAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/organizations/${payload.orgId}`, 'PUT', payload.body)

export const updateOrgLimitTypeAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/organizations/${payload.orgId}/limits-type`, 'PUT', payload.body)

export const updateOrgModelsLimitsAction = (payload) => (dispatch) =>
    apiClient(`/api/admin/organizations/${payload.orgId}/models/${payload.modelId}/limit`, 'PUT', payload.body)