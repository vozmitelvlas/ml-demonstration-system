import apiClient from "../utils/apiClient.jsx";

export const getOrgDataAction = (payload) => async (dispatch) =>
    apiClient(`/api/organizations/${payload}`).then((res) => {
            dispatch({
                type: "SET_ORG",
                payload: res
            })
            return res
        }
    ).catch(error => {
            throw error
        }
    )

export const getOrgMembersAction = (payload) => async (dispatch) =>
    apiClient(`/api/organizations/${payload}/members`).then(res => {
        dispatch({
            type: "SET_MEMBERS",
            payload: res
        })
    })

export const setOrgLimitAction = (payload) => (dispatch) =>
    apiClient(`/api/organizations/${payload.id}/limits-type`, 'PUT', payload.body)

