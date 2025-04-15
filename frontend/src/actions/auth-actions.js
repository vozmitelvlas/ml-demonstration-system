import apiClient from "../components/utils/apiClient.jsx";
import {commonDispatch} from "./commonUserDispatch.js";

export const loginUserAction = (payload) => (dispatch) =>
    apiClient('/api/auth/login', 'POST', payload).then(res =>
        commonDispatch(dispatch, res.user)
    )

export const registerUserAction = (payload) => (dispatch) =>
    apiClient('/api/auth/register', 'POST', payload).then(res =>
        commonDispatch(dispatch, res.user)
    )

export const sendPasswordTokenOnEmailAction = (payload) => (dispatch) =>
    apiClient(`/api/auth/password-reset`, 'POST', payload)

export const logOutAction = () => apiClient(`/api/auth/logout`)
