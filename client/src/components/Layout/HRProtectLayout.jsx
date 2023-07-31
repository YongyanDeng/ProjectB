import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { message } from "antd";

export default function HRProtectLayout() {
    const { employee } = useSelector((state) => state.employee);
    const location = useLocation();

    if (employee.role !== "HR") {
        message.error("HR Only");
        return <Navigate to="/" state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}
