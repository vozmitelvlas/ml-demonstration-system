const adminUserInitialState = {
    users: [],
    user: {},
    userLimits: [],
    formatUserLimits: {}
}

export const adminUserReducer = (state = adminUserInitialState, action) => {
    switch (action.type) {
        case "SET_USERS":
            return {
                ...state,
                users: action.payload.sort((a, b) => a.userId - b.userId)
            }
        case "DELETE_USER":
            return {
                ...state,
                users: state.users.filter(user => user.userId !== Number(action.payload))
            }
        case "ADD_USER":
            return {
                ...state,
                users: [
                    ...state.users,
                    action.payload
                ]
            }
        case "CHANGE_USER_ACCESS":
            return {
                ...state,
                users: state.users.map(user =>
                    user.userId === Number(action.payload.id)
                        ? {...user, active: action.payload.active}
                        : user
                )
            }
        case "SET_USER_FOR_ADMIN":
            return {
                ...state,
                userForAdmin: action.payload
            }
        case "SET_USER_LIMITS":
            return {
                ...state,
                userLimits: action.payload,
                formatUserLimits: action.payload
                    .sort((a, b) => a.modelId - b.modelId)
                    .reduce((acc, model) => {
                        acc[`rps${model.modelId}`] = model.limit.rps
                        acc[`requestsPerWeek${model.modelId}`] = model.limit.requestsPerWeek
                        return acc
                    }, {})
            }
        default:
            return state
    }
}