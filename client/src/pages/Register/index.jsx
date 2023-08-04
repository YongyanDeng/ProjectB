import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, message } from "antd";

import { registerCheck } from "app/employeeSlice";
import SignUp from "pages/Signup";

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const hashToken = location.pathname.split("/").pop();
    const { status } = useSelector((state) => state.employee);
    const { message: error } = useSelector((state) => state.error);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        dispatch(registerCheck({ hashToken }));
    }, []);

    useEffect(() => {
        if (status === "successed") {
            message.success("Welcome to Chuwa!");
            setTimeout(() => setChecked(true), 2000);
        } else if (status === "failed") {
            message.error(error);
            if (error.includes("Your register token is "))
                setTimeout(() => navigate("/signin"), 2000);
        }
    }, [status]);

    return (
        <>
            {checked ? (
                <>
                    <SignUp hashToken={hashToken} />
                </>
            ) : (
                <div className="statusBox">
                    <Spin size="large" />
                </div>
            )}
        </>
    );
}
