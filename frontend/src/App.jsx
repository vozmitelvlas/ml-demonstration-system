import styles from './App.module.css'
import Header from "./components/Header/Header.jsx";
import CatalogModels from "./components/Main/CatalogModels/CatalogModels.jsx";
import {Routes, Route} from "react-router-dom";
import CatalogUsers from "./components/Main/CatalogUsers/CatalogUsers.jsx";
import ChangeModel from "./components/Main/ChangeModels/ChangeModel.jsx";
import ChangeUser from "./components/Main/ChangeUser/ChangeUser.jsx";
import CatalogOrganisations from "./components/Main/CatalogOrganisations/CatalogOrganisations.jsx";
import ChangeOrganisation from "./components/Main/ChangeOrganisation/ChangeOrganisation.jsx";
import PersonalCabinet from "./components/Main/PersonalCabinet/PersonalCabinet.jsx";
import SignIn from "./components/Main/SignInUp/SignIn/SignIn.jsx";
import {useLocation} from 'react-router-dom';
import {useEffect, useState} from "react";
import ModelData from "./components/Main/ModelData/ModelData.jsx";
import SignUp from "./components/Main/SignInUp/SignUp/SignUp.jsx";
import PasswordRecover from "./components/Main/PasswordRecover/PasswordRecover.jsx";
import MyOrganisations from "./components/Main/MyOrganisations/MyOrganisations.jsx";
import PasswordReset from "./components/Main/PasswordRecover/PasswordReset.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getUserProfileAction} from "./actions/user-actions.js";
import {selectUserData, selectUserRoles} from "./selectors/user-selector.js";


function App() {
    const location = useLocation()
    const excludedPaths = ['/', '/signup', '/password', "/password-reset"]
    const [isConfirmed, setIsConfirmed] = useState(false)
    const dispatch = useDispatch()
    const {isAdminMode} = useSelector(selectUserRoles)
    const user = useSelector(selectUserData)

    useEffect(() => {
        if (user.userId === undefined && !excludedPaths.includes(location.pathname))
            dispatch(getUserProfileAction)
    }, [])

    return (
        <div className={isAdminMode ? styles.adminMain : styles.main}>
            {
                !excludedPaths.includes(location.pathname) &&
                <Header/>
            }
            <div className={styles.mainContent}>
                <Routes>
                    <Route path="/" element={<SignIn/>}/>
                    <Route path="/signup" element={<SignUp setIsConfirmed={setIsConfirmed}/>}/>
                    <Route path="/password" element={<PasswordRecover/>}/>
                    <Route path="/password-reset" element={<PasswordReset/>}/>

                    <Route path="/profile" element={<PersonalCabinet/>}/>
                    <Route path="/models"
                           element={<CatalogModels isAdminMode={isAdminMode} setIsConfirmed={setIsConfirmed}
                                                   isConfirmed={isConfirmed}/>}/>

                    <Route path="/models/:modelId/versions/:versionId/edit"
                           element={<ChangeModel isConfirmed={isConfirmed}/>}/>
                    <Route path="/models/:modelId/versions/:versionId/data" element={<ModelData/>}/>

                    <Route path="/users" element={<CatalogUsers/>}/>
                    <Route path="/users/:userId/edit" element={<ChangeUser/>}/>

                    <Route path="/organisation/:orgId" element={<MyOrganisations/>}/>

                    <Route path="/organisations" element={<CatalogOrganisations/>}/>
                    <Route path="/organisations/:orgId/edit" element={<ChangeOrganisation/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default App
