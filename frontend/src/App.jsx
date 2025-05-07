import styles from './App.module.css'
import Header from "./components/Headers/Header/Header.jsx";
import CatalogModels from "./pages/CatalogModels/CatalogModels.jsx";
import {Routes, Route} from "react-router-dom";
import CatalogUsers from "./pages/CatalogUsers/CatalogUsers.jsx";
import ChangeModel from "./pages/ChangeModels/ChangeModel.jsx";
import ChangeUser from "./pages/ChangeUser/ChangeUser.jsx";
import CatalogOrganisations from "./pages/CatalogOrganisations/CatalogOrganisations.jsx";
import ChangeOrganisation from "./pages/ChangeOrganisation/ChangeOrganisation.jsx";
import PersonalCabinet from "./pages/PersonalCabinet/PersonalCabinet.jsx";
import SignIn from "./pages/SignInUp/SignIn/SignIn.jsx";
import {useLocation} from 'react-router-dom';
import {useEffect, useState} from "react";
import ModelData from "./pages/ModelData/ModelData.jsx";
import SignUp from "./pages/SignInUp/SignUp/SignUp.jsx";
import PasswordRecover from "./pages/PasswordRecover/PasswordRecover.jsx";
import MyOrganisations from "./pages/MyOrganisations/MyOrganisations.jsx";
import PasswordReset from "./pages/PasswordRecover/PasswordReset.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getUserProfileAction} from "./actions/user-actions.js";
import {selectUserData, selectUserRoles} from "./selectors/user-selector.js";
import TritonModels from "./pages/TritonModels/TritonModels.jsx";


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
                    <Route path="/triton" element={<TritonModels />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
