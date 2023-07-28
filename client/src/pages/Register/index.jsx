import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Navigate, useLocation } from "react-router-dom";
import { Space, Spin, Typography, message } from "antd";

import { registerCheck } from "app/employeeSlice";

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const hashToken = location.pathname.split("/").pop();
    const { status } = useSelector((state) => state.employee);
    const { message: error } = useSelector((state) => state.error);

    useEffect(() => {
        console.log(hashToken);
        dispatch(registerCheck({ hashToken }));
    }, []);

    useEffect(() => {
        if (status === "successed") {
            message.success("Welcome to Chuwa!");
            setTimeout(() => navigate("/signup"), 2000);
        } else if (status === "failed") {
            message.error(error);
            setTimeout(() => navigate("/signin"), 2000);
        }
    }, [status]);

    return (
        <div className="statusBox">
            <Spin size="large" />
        </div>
    );
}
