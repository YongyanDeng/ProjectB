import "./styles.css";
import style from "./style.module.css";

import React from "react";
import { useSelector } from "react-redux";
import { Button, Form, Input, Typography } from "antd";

/**
 * Form for signup & signin
 * @param {String} buttonText
 * @param {function} onSubmit
 * @param {String} title
 * @param {Object} fields
 * @param {Object} errors
 */
export default function AuthForm({ buttonText, onSubmit, title, fields, errors, buttomText }) {
    const { status } = useSelector((state) => state.employee);

    return (
        <div className={style.FormBox}>
            <Typography.Title level={2} className={style.title}>
                {title}
            </Typography.Title>
            {errors ? <Typography className={style.error}>{errors}</Typography> : null}
            <Form onFinish={onSubmit} autoComplete="off" layout="vertical">
                {fields.map((field) => (
                    <Form.Item
                        key={field.name}
                        name={field.name}
                        label={field.name}
                        rules={field.rules}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        {field.type !== "password" ? (
                            <Input size="large" />
                        ) : (
                            <Input.Password size="large" />
                        )}
                    </Form.Item>
                ))}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className={style.btn}
                        size="large"
                        loading={status === "pending"}
                    >
                        {buttonText}
                    </Button>
                </Form.Item>
            </Form>
            <div className={style.buttomText}>{buttomText}</div>
        </div>
    );
}
