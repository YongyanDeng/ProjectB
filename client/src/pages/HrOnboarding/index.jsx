import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import emailjs from "@emailjs/browser";

import generateToken from "features/registerToken";
import { sendRegisterToken } from "app/hrSlice";

export default function HrOnboarding() {
    const dispatch = useDispatch();
    const { employee } = useSelector((state) => state.employee);
    const { isAuthenticated } = useSelector((state) => state.employee);

    useEffect(() => {
        emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
    }, []);

    if (!isAuthenticated) return <Navigate to="/signin" state={{ from: "/" }} />;

    const onSubmit = async ({ email }) => {
        const hashToken = await generateToken(32);
        // encode the token
        const encodedToken = encodeURIComponent(hashToken);

        // Send the email, then upload this token to database
        emailjs
            .send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_REGISTER_TEMPLATE,
                {
                    email,
                    to_name: `${email.split("@")[0]}`,
                    from_name: "dyy",
                    message: { link: `http://localhost:3000/register/${encodedToken}` },
                },
            )
            .then((res) => {
                message.success("Email Sent!");
                dispatch(sendRegisterToken({ id: employee.id, hashToken }));
            })
            .catch((err) => console.error(err));
    };

    return (
        <>
            <Form onFinish={onSubmit} autoComplete="off" layout="vertical">
                <Form.Item
                    key="email"
                    name="email"
                    label="email"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                >
                    <Input size="large"></Input>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large">
                        Send Email
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
