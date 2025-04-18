const userDataInitialState = {
    user: {},
    roles: {
        isAdmin: false,
        isAdminMode: false,
        isDirector: false,
    },
}

export const userReducer = (state = userDataInitialState, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload
            }
        case "SET_ADMIN_STATE":
            return {
                ...state,
                roles: {
                    ...state.roles,
                    isAdmin: action.payload
                }
            }
        case "SET_DIRECTOR_STATE":
            return {
                ...state,
                roles: {
                    ...state.roles,
                    isDirector: action.payload
                }
            }
        case "SET_ADMIN_MODE":
            return {
                ...state,
                roles: {
                    ...state.roles,
                    isAdminMode: action.payload
                }
            }
        case "UPDATE_USER":
            return {
                ...state,
                user: {
                    ...action.payload
                }
            }
        case "RESET_USER_STATE":
            return userDataInitialState
        default:
            return state
    }
}