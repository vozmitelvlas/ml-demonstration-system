export const commonDispatch = (dispatch, payload) => {
    dispatch({
        type: "SET_USER",
        payload: payload
    })
    dispatch({
        type: "SET_ADMIN_STATE",
        payload: payload.roles.includes("ADMIN")
    })
    dispatch({
        type: "SET_DIRECTOR_STATE",
        payload: payload.roles.includes("ORGANIZATION_HEAD")
    })
    dispatch({
        type: "SET_ADMIN_MODE",
        payload: JSON.parse(sessionStorage.getItem("isAdminMode"))
    })
}