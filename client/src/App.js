import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "pages/Home";
import SignUp from "pages/Signup";
import SignIn from "pages/Signin";
import ProtectLayout from "components/Layout/ProtectLayout";
import HRProtectLayout from "components/Layout/HRProtectLayout";
import AuthProtectLayout from "components/Layout/AuthProtectLayout";
import UpdatePassword from "pages/UpdatePassword";
import Register from "pages/Register";

import HrProfiles from "pages/HrProfiles";
import HrProfileDetail from "pages/HrProfileDetail";

import Visa from "pages/HrVisa";
import HrVisaDetail from "pages/HrVisaDetail";

import EmailHistory from "pages/EmailHistory";
import HiringManagement from "pages/HrHiringManagement";
import HrOnboardingDetail from "pages/HrOnboardingDetail";

import PersonalInfoPage from "pages/EmployeePersonalInfo";
import EmployeeVisa from "pages/EmployeeVisa";

import NotFound from "pages/NotFound";

import OnboardingPage from "pages/EmployeeOnboardingApplication";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="register/:hashToken" element={<Register />} />
                    <Route element={<AuthProtectLayout />}>
                        <Route path="signup" element={<SignUp />} />
                        <Route path="signin" element={<SignIn />} />
                        <Route path="updatePassword" element={<UpdatePassword />} />
                    </Route>
                    <Route element={<ProtectLayout />}>
                        <Route path="/hr" element={<HRProtectLayout />}>
                            <Route path="profiles" element={<HrProfiles />} />
                            <Route path="profiles/:employeeId" element={<HrProfileDetail />} />
                            <Route path="visas" element={<Visa />} />
                            <Route path="emailHistory" element={<EmailHistory />} />
                            <Route path="hiringManagement" element={<HiringManagement />} />
                            <Route
                                path="hiringManagement/:employeeId"
                                element={<HrOnboardingDetail />}
                            />
                            <Route path="visaDetail/:employeeId" element={<HrVisaDetail />} />
                        </Route>
                        <Route path="/employee/onboarding" element={<OnboardingPage />} />
                        <Route path="/employee/:id/profile" element={<PersonalInfoPage />} />
                        <Route path="/employee/:id/visa" element={<EmployeeVisa />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
