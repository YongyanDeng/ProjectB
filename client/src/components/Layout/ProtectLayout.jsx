import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectLayout() {
    const { isAuthenticated } = useSelector((state) => state.employee);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location.pathname }} />;
    }
    return <Outlet />;
}
