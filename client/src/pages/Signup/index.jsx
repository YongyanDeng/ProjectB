import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthForm from "components/AuthForm";
import { signUpEmployee } from "app/employeeSlice";
import { removeError } from "app/errorSlice";
import { Typography } from "antd";

export default function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status } = useSelector((state) => state.employee);
    const { message: error } = useSelector((state) => state.error);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        dispatch(removeError());
    }, []);

    // Redirect to signin page
    useEffect(() => {
        if (submitted && status === "successed") navigate("/signin");
    }, [status]);

    const fields = [
        {
            name: "Email",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Email Cannot be Empty",
                },
                {
                    type: "email",
                    message: "Invalid Email Format",
                },
            ],
        },
        {
            name: "Password",
            type: "password",
            rules: [
                {
                    required: true,
                    message: "Invalid Password Input",
                },
            ],
        },
    ];

    const onSubmit = (data) => {
        setSubmitted(true);
        // Convert to lowercase to match database's property
        const { Email: email, Password: password } = data;
        dispatch(signUpEmployee({ email, password }));
    };

    return (
        <div>
            <AuthForm
                buttonText="Create account"
                onSubmit={onSubmit}
                title="Sign up an account"
                fields={fields}
                errors={error}
                buttomText={
                    <>
                        <Typography>
                            Already have an account? <Link to={"/signin"}>Sign in</Link>
                        </Typography>
                    </>
                }
            ></AuthForm>
        </div>
    );
}
