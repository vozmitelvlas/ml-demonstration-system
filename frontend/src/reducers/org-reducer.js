const orgInitialState = {
    org: {},
    members: [],
    formatOrgs: []
}

export const orgReducer = (state = orgInitialState, action) => {
    switch (action.type) {
        case "SET_ORG":
            return {
                ...state,
                org: {
                    ...action.payload
                }
            }
        case "SET_MEMBERS":
            return {
                ...state,
                members: [
                    ...action.payload
                ]
            }
        case "SET_FORMAT_ORGANISATIONS":
            return {
                ...state,
                formatOrgs: action.payload.map(org => ({value: org.organizationId, label: org.name}))
            }
        default:
            return state
    }
}