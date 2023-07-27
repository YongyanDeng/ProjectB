import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import emailjs from "@emailjs/browser";

import generateToken from "features/registerToken";
import { sendRegisterToken } from "app/hrSlice";

export default function Home() {
    return (
        <>
            <h1>Home Page</h1>
        </>
    );
}
