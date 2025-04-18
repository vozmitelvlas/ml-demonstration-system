const messageInitialState = {
    message: "",
    logo: null
}

export const messageReducer = (state = messageInitialState, action) => {
    switch (action.type){
        case "SET_MESSAGE":
            return {
                ...state,
                ...action.payload
            }

        case "RESET_MSG_STATE":
            return messageInitialState

        default:
            return state
    }
}