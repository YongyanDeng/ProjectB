import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import emailjs from "@emailjs/browser";

import generateToken from "features/registerToken";
import { sendRegisterToken } from "app/hrSlice";

export default function EmailSender() {
    const dispatch = useDispatch();
    const { employee } = useSelector((state) => state.employee);

    useEffect(() => {
        emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
    }, []);

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
                dispatch(sendRegisterToken({ id: employee.id, hashToken, email }));
            })
            .catch((err) => console.error(err));
    };

    return (
        <Form onFinish={onSubmit} autoComplete="off" layout="inline">
            <Form.Item
                key="email"
                name="email"
                rules={[
                    {
                        required: true,
                        message: "Email Cannot be empty",
                    },
                    {
                        type: "email",
                        message: "Invalid Email Format",
                    },
                ]}
            >
                <Input prefix={<MailOutlined />} placeholder="Email"></Input>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Send Email
                </Button>
            </Form.Item>
        </Form>
    );
}
