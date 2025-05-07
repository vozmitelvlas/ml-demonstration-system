const adminOrgInitialState = {
    orgs: [],
    org: {},
    orgModels: [],
    formatOrgLimits: {},
    orgLimitType: ""
}

export const adminOrgReducer = (state = adminOrgInitialState, action) => {
    switch (action.type) {
        case "SET_ORGANISATIONS":
            return {
                ...state,
                orgs: action.payload.sort((a, b) => a.organizationId - b.organizationId)
            }
        case "ADD_ORG":
            return {
                ...state,
                orgs: [
                    ...state.orgs,
                    action.payload
                ]
            }
        case "DELETE_ORG":
            return {
                ...state,
                orgs: state.orgs.filter(org => org.organizationId !== Number(action.payload))
            }
        case "SET_ORG_FOR_ADMIN":
            return {
                ...state,
                org: action.payload
            }
        case "SET_ORG_LIMITS":
            return {
                ...state,
                formatOrgLimits: action.payload.reduce((acc, model) => {
                    acc[`rps${model.modelId}`] = model.limit.rps
                    acc[`requestsPerWeek${model.modelId}`] = model.limit.requestsPerWeek
                    return acc
                }, {})
            }
        case "SET_ORG_MODELS":
            return {
                ...state,
                orgModels: action.payload.sort((a, b) => a.modelId - b.modelId)
            }
        case "DELETE_ORG_MODEL":
            return {
                ...state,
                orgModels: state.orgModels.filter(secondItem =>
                    action.payload.some(firstItem => firstItem.value === secondItem.modelId))
            }
        case "ADD_ORG_MODEL":
            return {
                ...state,
                orgModels: [
                    ...state.orgModels,
                    action.payload
                ]
            }
        default:
            return state
    }
}