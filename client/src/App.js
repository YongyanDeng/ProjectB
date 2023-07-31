import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "pages/Home";
import SignUp from "pages/Signup";
import SignIn from "pages/Signin";
import ProtectLayout from "components/Layout/ProtectLayout";
import AuthProtectLayout from "components/Layout/AuthProtectLayout";
import UpdatePassword from "pages/UpdatePassword";
import NotFound from "pages/NotFound";
import PersonalInfoPage from "pages/EmployeePersonalInfo";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route element={<AuthProtectLayout />}>
                        <Route path="signup" element={<SignUp />} />
                        <Route path="signin" element={<SignIn />} />
                        <Route
                            path="updatePassword"
                            element={<UpdatePassword />}
                        />
                    </Route>
                    <Route element={<ProtectLayout />}></Route>
                    <Route
                        path="/employee/:id/profile"
                        element={<PersonalInfoPage />}
                    />
                    {/* <Route
                        path="/employee/:id/visa"
                        element={<EmployeeVisa />}
                    /> */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
