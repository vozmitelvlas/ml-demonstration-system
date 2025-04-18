import {createStore, applyMiddleware, compose, combineReducers} from "redux"
import {userReducer, messageReducer, orgReducer, modelReducer, adminModelReducer} from "../reducers/index.js"
import {thunk} from "redux-thunk"
import {adminUserReducer} from "../reducers/admin-user-reducer.js";
import {adminOrgReducer} from "../reducers/admin-org-reducer.js";

const reducer = combineReducers({
    user: userReducer,
    msg: messageReducer,
    org: orgReducer,
    model: modelReducer,
    adminModel: adminModelReducer,
    adminUser: adminUserReducer,
    adminOrg: adminOrgReducer,
})

export const store = createStore(reducer, compose(applyMiddleware(thunk)))