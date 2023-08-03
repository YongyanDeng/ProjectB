import "./styles.css";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, Input, Select, Button, message, Spin } from "antd";

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
            let tmp = selectedEmployee.documents.map((document) => {
                let blob = new Blob([new Uint8Array(document.content.data)], {
                    type: "application/pdf",
                });
                // Open the PDF in a new window or tab
                let pdfUrl = URL.createObjectURL(blob);
                return {
                    id: document.id,
                    uid: document.uid,
                    name: document.document_name,
                    document_type: document.document_type,
                    contentType: document.contentType,
                    file_url: pdfUrl, // Use the uploaded file URL here
                    thumbUrl: pdfUrl,
                    fromDocuments: "yes",
                };
            });
            const tmpSE = { ...selectedEmployee };
            tmpSE.documents = tmp;
            setDetail(tmpSE);
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
            .catch(() => {
                message.error(errMessage);
            });
    };

    return (
        <>
            {detail ? (
                <div className="center-wrapper">
                    <EmployeeForm
                        formData={detail}
                        personalInfo={false}
                        title={"Application Detail"}
                        onboardingStatus={detail.onboarding_status}
                        isDisabled={true}
                        files={detail.documents}
                        hrStatus={status}
                    />
                    <Form
                        className="review-section"
                        onFinish={handleSubmit}
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 15 }}
                    >
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
                                    placeholder="Please leave your feedback here."
                                    value={feedback}
                                    onChange={handleFeedback}
                                />
                            </Form.Item>
                        ) : null}
                        <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ) : (
                <Spin size="large" />
            )}
        </>
    );
}
