export const modelInitialState = {
    problemTypes: [],
    runtimes: [],
    modelVersions: [],
    modelVersionData: {},
    formatModels: [],
    allModels: []
}

export const modelReducer = (state = modelInitialState, action) => {
    switch (action.type) {
        case "SET_RUNTIMES":
            return {
                ...state,
                runtimes: action.payload.map((runtime) => ({
                    value: runtime.name,
                    label: runtime.value
                }))
            }
        case "SET_PROBLEM_TYPES":
            return {
                ...state,
                problemTypes: action.payload.map((problemType) => ({
                    value: problemType.name,
                    label: problemType.value,
                }))
            }
        default:
            return state
    }
}