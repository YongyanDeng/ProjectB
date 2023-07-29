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
import Profiles from "pages/HrProfiles";
import Visa from "pages/HrVisa";
import EmailHistory from "pages/EmailHistory";
import HiringManagement from "pages/HrHiringManagement";
import NotFound from "pages/NotFound";

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
                        <Route element={<HRProtectLayout />}>
                            <Route path="hr/profiles" element={<Profiles />} />
                            <Route path="hr/visas" element={<Visa />} />
                            <Route path="hr/emailHistory" element={<EmailHistory />} />
                            <Route path="hr/hiringManagement" element={<HiringManagement />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
