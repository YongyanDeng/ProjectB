import "./styles.css";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, Input, Select, Button, message } from "antd";
import { FilePdfOutlined, MailOutlined } from "@ant-design/icons";

import { getProfileDetail, reviewOBApplication } from "app/hrSlice";
import EmployeeForm from "components/EmployeeForm";

export default function HrOnboardingDetail() {
    const dispatch = useDispatch();
    const { employeeId } = useParams();
    const { employee } = useSelector((state) => state.employee);
    const { selectedEmployee, status } = useSelector((state) => state.hr);
    const { error: errMessage } = useSelector((state) => state.error);
    const [detail, setDetail] = useState(null);
    const [review, setReview] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        dispatch(getProfileDetail({ id: employee.id, employeeId }));
    }, []);

    useEffect(() => {
        if (status === "successed" && selectedEmployee.id === employeeId) {
            setDetail(selectedEmployee);
        }
    }, [selectedEmployee]);

    const handleOptionChange = (value) => {
        setReview(value);
    };

    const handleFeedback = (e) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = () => {
        // update application review
        dispatch(reviewOBApplication({ id: employee.id, employeeId, review, feedback }))
            .then(() => message.success("Reviewed"))
            .catch((err) => {
                message.error(errMessage);
            });
    };

    return (
        <div className="center-wrapper">
            {detail ? (
                <>
                    <EmployeeForm
                        employee={detail}
                        personalInfo={false}
                        title={"Personal Information"}
                        onboardingStatus={detail.onboarding_status}
                        isDisabled={true}
                        files={detail.documents}
                        hrStatus={status}
                    />
                    <Form onFinish={handleSubmit}>
                        <Form.Item label="Review">
                            <Select
                                placeholder="HR Review"
                                options={[
                                    { value: "Approved", label: "Approve" },
                                    { value: "Rejected", label: "Reject" },
                                ]}
                                onChange={handleOptionChange}
                            />
                        </Form.Item>
                        {review === "Rejected" ? (
                            <Form.Item label="Feedback">
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Write your feedback here."
                                    value={feedback}
                                    onChange={handleFeedback}
                                />
                            </Form.Item>
                        ) : null}
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
}
