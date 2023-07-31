import "./styles.css";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, Input, Table, Button, Select, Space, message } from "antd";
import { FilePdfOutlined, MailOutlined } from "@ant-design/icons";
import emailjs from "@emailjs/browser";

import { getVisaDetail, reviewVisa } from "app/hrSlice";

const visaProcess = ["OPT Receipt", "OPT EAD", "I-983", "I-20"];

export default function HrVisaDetail() {
    const dispatch = useDispatch();
    const { employeeId } = useParams();
    const { employee } = useSelector((state) => state.employee);
    const { selectedEmployee, status } = useSelector((state) => state.hr);
    const { error: errMessage } = useSelector((state) => state.error);
    const [detail, setDetail] = useState(null);
    const [review, setReview] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
        dispatch(getVisaDetail({ id: employee.id, employeeId }));
    }, []);

    useEffect(() => {
        if (status === "successed" && !!Object.keys(selectedEmployee).length) {
            const docs = selectedEmployee.documents.map((document, index) => {
                return {
                    key: index + 1,
                    name: document.document_name,
                    content: document.content.data,
                    type: document.document_type,
                    status: document.document_status,
                };
            });

            let next_step = null;
            const last = selectedEmployee.documents[selectedEmployee.documents.length - 1];
            if (last?.document_status !== "approved") {
                next_step = visaProcess[Math.min(3, selectedEmployee.documents.length - 1)];
            } else if (selectedEmployee.documents.length < 4) {
                next_step = visaProcess[selectedEmployee.documents.length];
            }

            setDetail({
                name: `${selectedEmployee.name.first_name} ${selectedEmployee.name.last_name}`,
                work_authorization: selectedEmployee.work_authorization,
                documents: docs,
                next_step,
            });
        }
    }, [selectedEmployee]);

    const columns = [
        {
            title: "Document name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Document type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Document status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "",
            dataIndex: "content",
            key: "url",
            render: (content) => {
                return (
                    <Button type="link" onClick={() => handlePreview(content)}>
                        <FilePdfOutlined style={{ fontSize: "25px", color: "red" }} />
                    </Button>
                );
            },
        },
    ];

    // handle pdf preview in new window
    const handlePreview = (content) => {
        // Data transfer: Buffer -> Blob
        const uint8Array = new Uint8Array(content);
        const pdfBlob = new Blob([uint8Array], { type: "application/pdf" });

        // Open the PDF in a new window or tab
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
        // Revoke the object URL after use to release memory
        URL.revokeObjectURL(pdfUrl);
    };

    const handleOptionChange = (value) => {
        setReview(value);
    };

    const handleFeedback = (e) => {
        setFeedback(e.target.value);
    };

    const handleNotification = async () => {
        let email = "deng.yo@northeastern.edu";
        emailjs
            .send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_NOTIFICATION_TEMPLATE,
                {
                    email,
                    to_name: `${detail.name}`,
                    from_name: "dyy",
                    message: { next_step: detail.next_step },
                },
            )
            .then((res) => {
                message.success("Notification Sent!");
            })
            .catch((err) => console.error(err));
    };

    const handleFormSubmit = () => {
        // Update file review & feedback
        dispatch(reviewVisa({ id: employee.id, employeeId, review, feedback }))
            .then(() => message.success("Reviewed"))
            .catch((err) => {
                message.error(errMessage);
            });
    };

    return (
        <>
            {detail ? (
                <div className="detail">
                    <Form onFinish={handleFormSubmit} labelAlign="left" labelCol={{ span: 10 }}>
                        <Form.Item label="Name">
                            <Input value={detail.name} disabled={true} />
                        </Form.Item>
                        <Form.Item label="Work Authorization">
                            <Input value={detail.work_authorization.title} disabled={true} />
                        </Form.Item>
                        <Form.Item label="Start Date">
                            <Input
                                value={
                                    detail.work_authorization.start_date
                                        ? new Date(
                                              detail.work_authorization.start_date,
                                          ).toLocaleString("en-US", {
                                              month: "numeric",
                                              day: "numeric",
                                              year: "numeric",
                                          })
                                        : null
                                }
                                disabled={true}
                            />
                        </Form.Item>
                        <Form.Item label="End Date">
                            <Input
                                value={
                                    detail.work_authorization.end_date
                                        ? new Date(
                                              detail.work_authorization.end_date,
                                          ).toLocaleString("en-US", {
                                              month: "numeric",
                                              day: "numeric",
                                              year: "numeric",
                                          })
                                        : null
                                }
                                disabled={true}
                            />
                        </Form.Item>
                        <Form.Item label="Remaining">
                            <Input
                                value={detail?.work_authorization.remaining_days}
                                disabled={true}
                                suffix="days"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Table dataSource={detail?.documents} columns={columns} />
                        </Form.Item>
                        {detail.next_step ? (
                            <Form.Item label="Review">
                                <Select
                                    placeholder="HR Review"
                                    options={[
                                        { value: "approved", label: "Approve" },
                                        { value: "rejected", label: "Reject" },
                                    ]}
                                    onChange={handleOptionChange}
                                />
                            </Form.Item>
                        ) : null}
                        {review === "rejected" ? (
                            <Form.Item label="Feedback">
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Write your feedback here."
                                    value={feedback}
                                    onChange={handleFeedback}
                                />
                            </Form.Item>
                        ) : null}
                        {detail.next_step ? (
                            <Form.Item label="Next Step">
                                <Space.Compact>
                                    <Input value={detail.next_step} />
                                    <Button type="primary" onClick={handleNotification}>
                                        <MailOutlined />
                                    </Button>
                                </Space.Compact>
                            </Form.Item>
                        ) : null}
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ) : (
                <h1>Loading..</h1>
            )}
        </>
    );
}
