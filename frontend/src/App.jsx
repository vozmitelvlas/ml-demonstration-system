import styles from './App.module.css'
import Header from "./components/Header/Header.jsx";
import CatalogModels from "./components/Main/CatalogModels/CatalogModels.jsx";
import {Routes, Route, Outlet, Navigate} from "react-router-dom";
import CatalogUsers from "./components/Main/CatalogUsers/CatalogUsers.jsx";
import ChangeModelData from "./components/Main/CatalogModels/ChangeModelData.jsx";
import ChangeUserData from "./components/Main/CatalogUsers/ChangeUserData.jsx";
import CatalogOrganisations from "./components/Main/CatalogOrganisations/CatalogOrganisations.jsx";
import ChangeOrganisations from "./components/Main/CatalogOrganisations/ChangeOrganisations.jsx";
import PersonalCabinet from "./components/Main/PersonalCabinet/PersonalCabinet.jsx";
import SignIn from "./components/Main/SignInUp/SignIn.jsx";
import { useLocation } from 'react-router-dom';
import {useState} from "react";
import ModelData from "./components/Main/CatalogModels/ModelData.jsx";
import SignUp from "./components/Main/SignInUp/SignUp.jsx";
import PasswordRecover from "./components/Main/SignInUp/PasswordRecover.jsx";
import MyOrganisations from "./components/Main/MyOrganisations/MyOrganisations.jsx";


function ProtectedRoute({ isAuthenticated }) {
    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }
    return <Outlet />;
}

function App() {
    let userLogin = "user_login";
    const location = useLocation();
    const [isAdminMode, setIsAdminMode] = useState(false);
    const excludedPaths = ['/', '/signup', '/password'];

    return (
        <div className={isAdminMode ? styles.adminMain : styles.main}>
            {
                !excludedPaths.includes(location.pathname) &&
                <Header login={userLogin} isMainOrg={true} isAdmin={true} isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode}/>
            }
            <div className={styles.mainContent}>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/password" element={<PasswordRecover />} />

                    <Route path="/user" element={<PersonalCabinet />} />
                    <Route path="/models" element={<CatalogModels isAdminMode={isAdminMode} />} />

                    <Route path="/models/:modelId/edit" element={<ChangeModelData />} />
                    <Route path="/models/:modelId/data" element={<ModelData />} />

                    <Route path="/users" element={<CatalogUsers />} />
                    <Route path="/users/:userId/edit" element={<ChangeUserData />} />

                    <Route path="/user/organisation" element={<MyOrganisations />} />

                    <Route path="/organisations" element={<CatalogOrganisations />} />
                    <Route path="/organisations/:orgId/edit" element={<ChangeOrganisations />} />
                </Routes>
            </div>
        </div>
    );
}

export default App
