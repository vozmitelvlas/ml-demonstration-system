import styles from './App.module.css'
import Header from "./components/Header/Header.jsx";
import CatalogModels from "./components/Main/CatalogModels/CatalogModels.jsx";
import {Routes, Route} from "react-router-dom";
import CatalogUsers from "./components/Main/CatalogUsers/CatalogUsers.jsx";
import ChangeModel from "./components/Main/CatalogModels/ChangeModel.jsx";
import ChangeUser from "./components/Main/CatalogUsers/ChangeUser.jsx";
import CatalogOrganisations from "./components/Main/CatalogOrganisations/CatalogOrganisations.jsx";
import ChangeOrganisation from "./components/Main/CatalogOrganisations/ChangeOrganisation.jsx";
import PersonalCabinet from "./components/Main/PersonalCabinet/PersonalCabinet.jsx";
import SignIn from "./components/Main/SignInUp/SignIn.jsx";
import {useLocation} from 'react-router-dom';
import {useEffect, useState} from "react";
import ModelData from "./components/Main/CatalogModels/ModelData.jsx";
import SignUp from "./components/Main/SignInUp/SignUp.jsx";
import PasswordRecover from "./components/Main/SignInUp/PasswordRecover.jsx";
import MyOrganisations from "./components/Main/MyOrganisations/MyOrganisations.jsx";
import apiClient from "./components/utils/apiClient.jsx";
import PasswordReset from "./components/Main/SignInUp/PasswordReset.jsx";


function App() {
    const location = useLocation();
    const [isAdminMode, setIsAdminMode] = useState(false);
    const excludedPaths = ['/', '/signup', '/password', "/password-reset"];
    const [isAdmin, setIsAdmin] = useState(false)
    const [isMainOrg, setMainOrg] = useState(false)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        if (userData === null && !excludedPaths.includes(location.pathname)) {
            apiClient(`/api/users/profile`)
                .then((res) => {
                    setUserData(res)
                    setIsAdmin(res.roles.includes("ADMIN"))
                    setMainOrg(res.roles.includes("ORGANIZATION_HEAD"))
                    setIsAdminMode(JSON.parse(sessionStorage.getItem("isAdminMode")))
                })
                .catch(error => {
                    console.error(error)
                })
        }
    }, []);

    return (
        <div className={isAdminMode ? styles.adminMain : styles.main}>
            {
                !excludedPaths.includes(location.pathname) &&
                <Header
                    login={userData?.login}
                    isMainOrg={isMainOrg}
                    isAdmin={isAdmin}
                    isAdminMode={isAdminMode}
                    setIsAdminMode={setIsAdminMode}
                    orgId={userData?.organization?.organizationId}
                />
            }
            <div className={styles.mainContent}>
                <Routes>
                    <Route path="/" element={<SignIn setUserData={setUserData} setIsAdmin={setIsAdmin} setMainOrg={setMainOrg} />}/>
                    <Route path="/signup" element={<SignUp setUserData={setUserData} setIsAdmin={setIsAdmin} setMainOrg={setMainOrg}/>}/>
                    <Route path="/password" element={<PasswordRecover/>}/>
                    <Route path="/password-reset" element={<PasswordReset/>}/>

                    <Route path="/profile" element={<PersonalCabinet userData={userData} setUserData={setUserData}/>}/>
                    <Route path="/models" element={<CatalogModels isAdminMode={isAdminMode}/>}/>

                    <Route path="/models/:modelId/versions/:versionId/edit" element={<ChangeModel/>}/>
                    <Route path="/models/:modelId/versions/:versionId/data" element={<ModelData isAdmin={isAdmin}/>}/>

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
