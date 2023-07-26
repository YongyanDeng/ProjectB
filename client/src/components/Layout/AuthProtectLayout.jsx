import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// If there is a user logged, signin/signup/updatepassword will be redirected to the home page
export default function AuthProtectLayout() {
    const { isAuthenticated } = useSelector((state) => state.employee);
    const location = useLocation();

    if (isAuthenticated) {
        return <Navigate to="/" state={{ from: location.pathname }} />;
    }
    return <Outlet />;
}
