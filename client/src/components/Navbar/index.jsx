import "./styles.css";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Typography, Button, Popover, Space, message } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { logOut } from "app/employeeSlice";

const { Title } = Typography;
const title = "Chuwa Employee Management System";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { pathname: location } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, employee } = useSelector((state) => state.employee);

    // useEffect(() => {
    //     if (isAuthenticated) dispatch(getCart(user));
    // }, [isAuthenticated]);

    useEffect(() => {
        setOpen(false);
    }, [location]);

    const handleSignoutBtnClick = (e) => {
        if (e.target.innerText === "Sign Out") dispatch(logOut());
        navigate("/signin");
    };

    const closePopover = () => {
        setOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="title">
                <Title level={3} style={{ margin: 0, color: "#FFF" }}>
                    {title}
                </Title>
            </div>

            <div className="right-menu">
                <div className="menu">
                    <Button onClick={handleSignoutBtnClick}>
                        <Space style={{ color: "#FFF", fontFamily: "Inter", fontSize: "15px" }}>
                            <UserOutlined style={{ fontSize: "20px" }} />
                            {isAuthenticated ? `Sign Out` : `Sign In`}
                        </Space>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
