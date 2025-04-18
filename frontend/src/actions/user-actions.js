import apiClient from "../utils/apiClient.jsx";
import {commonDispatch} from "./commonUserDispatch.js";


export const getUserProfileAction = (dispatch) =>
    apiClient(`/api/users/profile`).then(res =>
        commonDispatch(dispatch, res)
    )

export const setAdminModeAction = (payload) => ({
    type: "SET_ADMIN_MODE",
    payload: payload
})

export const updateUserDataAsUserAction = (payload) => (dispatch) =>
    apiClient(`/api/users/profile`, 'PUT', payload).then(res =>
        dispatch({
            type: "UPDATE_USER",
            payload: res
        })
    )

export const deleteUserAsUserAction = () => (dispatch) =>
    apiClient(`/api/users/profile`, 'DELETE').then(() => {
        dispatch({
            type: "RESET_USER_STATE"
        })
    })

export const updateUserPasswordAction = (payload) => (dispatch) =>
    apiClient(`/api/users/profile/password`, 'PUT', payload)

export const sendNewPasswordWithTokenAction = (payload) => (dispatch) =>
    apiClient('/api/users/profile/password/reset', "POST", payload.body, {
        Authorization: `Bearer ${payload.token}`
    })


export const sendEmailConfirmationWithToken = (payload) => (dispatch) =>
    apiClient('/api/users/profile/email/confirm', "POST", null, {
        Authorization: `Bearer ${payload}`
    })