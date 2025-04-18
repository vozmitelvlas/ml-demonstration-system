import acceptLogo from "../assets/accept.svg"
import alarmLogo from "../assets/alarm.svg"

export const setAcceptMessageAction = (payload) => ({
    type: "SET_MESSAGE",
    payload: {
        logo: acceptLogo,
        message: payload
    }
})

export const setRejectMessageAction = (payload) => ({
    type: "SET_MESSAGE",
    payload: {
        logo: alarmLogo,
        message: payload
    }
})

export const resetMessageStateAction = ({
    type: "RESET_MSG_STATE"
})