import {modelInitialState} from "./model-reducer.js";


export const adminModelReducer = (state = modelInitialState, action) => {
    switch (action.type) {
        case "SET_MODELS":
            return {
                ...state,
                allModels: action.payload
            }
        case "SET_FORMAT_MODELS":
            return {
                ...state,
                formatModels: action.payload.map((model) => ({
                    value: model.modelId,
                    label: model.name,
                }))
            }
        case "SET_MODEL_VERSIONS":
            return {
                ...state,
                modelVersions: action.payload.sort((a, b) => a.modelVersionId - b.modelVersionId)
            }
        case "SET_MODEL_VERSION_DATA":
            return {
                ...state,
                modelVersionData: {
                    ...state.modelVersionData,
                    ...action.payload
                }
            }
        case "DELETE_MODEL":
            return {
                ...state,
                modelVersions: state.modelVersions.filter(model =>
                    model.modelVersionId !== Number(action.payload)
                )
            }
        case "ADD_MODEL":
            return {
                ...state,
                modelVersions: [
                    ...state.modelVersions,
                    action.payload
                ]
            }
        case "ADD_MODEL_VERSION":
            return {
                ...state,
                modelVersions: [
                    ...state.modelVersions,
                    action.payload
                ]
            }
        default:
            return state
    }
}