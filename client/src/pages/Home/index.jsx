import React from "react";
import PersonalInfoPage from "pages/EmployeePersonalInfo";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function Home() {
    const { isAuthenticated } = useSelector((state) => state.employee);

    if (!isAuthenticated)
        return <Navigate to="/signin" state={{ from: "/" }} />;
    return <PersonalInfoPage />;
}
