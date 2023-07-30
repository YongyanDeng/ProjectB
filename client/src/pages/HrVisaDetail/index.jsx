import "./styles.css";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, Input, Table, Button, Select, Space, message } from "antd";
import { DownloadOutlined, MailOutlined } from "@ant-design/icons";
import emailjs from "@emailjs/browser";

import { getVisaDetail } from "app/hrSlice";
import generateToken from "features/registerToken";

export default function HrVisaDetail() {
    const dispatch = useDispatch();
    const { employeeId } = useParams();
    const { employee } = useSelector((state) => state.employee);
    const { selectedEmployee, status } = useSelector((state) => state.hr);
    const [detail, setDetail] = useState(null);
    const [review, setReview] = useState("");
    const [feedback, setFeedback] = useState("");
    const visaProcess = ["OPT Receipt", "OPT EAD", "I-983", "I-20"];

    useEffect(() => {
        emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
        dispatch(getVisaDetail({ id: employee.id, employeeId }));
    }, []);

    useEffect(() => {
        if (status === "successed" && !!Object.keys(selectedEmployee).length) {
            const docs = selectedEmployee.documents.map((document, index) => {
                const pdfBlob = new Blob(document.content.data, {
                    type: "application/pdf",
                });
                return {
                    key: index + 1,
                    name: document.document_name,
                    download_info: { fileName: document.document_name, pdfBlob },
                    type: document.document_type,
                    status: document.document_status,
                };
            });

            let next_step = null;
            if (
                selectedEmployee.documents.length < 4 ||
                selectedEmployee.documents.slice(-1)[0].status !== "approved"
            )
                next_step = visaProcess[selectedEmployee.documents.length];

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
            dataIndex: "download_info",
            key: "url",
            render: (download_info) => {
                return <DownloadOutlined onClick={() => handleDownload(download_info)} />;
            },
        },
    ];

    const handleDownload = (download_info) => {
        const { fileName, pdfBlob } = download_info;

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.setAttribute("download", fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const handleOptionChange = (value) => {
        setReview(value);
    };

    const handleFeedback = (e) => {
        setFeedback(e.target.value);
    };

    const handleNotification = async () => {
        console.log("send notification", detail.next_step);

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
        console.log(review, feedback);
    };

    return (
        <div className="detail">
            <Form onFinish={handleFormSubmit} labelAlign="left" labelCol={{ span: 10 }}>
                <Form.Item label="Name">
                    <Input value={detail?.name} disabled={true} />
                </Form.Item>
                <Form.Item label="Work Authorization">
                    <Input value={detail?.work_authorization.title} disabled={true} />
                </Form.Item>
                <Form.Item label="Start Date">
                    <Input
                        value={new Date(detail?.work_authorization.start_date).toLocaleString(
                            "en-US",
                            {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                            },
                        )}
                        disabled={true}
                    />
                </Form.Item>
                <Form.Item label="End Date">
                    <Input
                        value={new Date(detail?.work_authorization.end_date).toLocaleString(
                            "en-US",
                            {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                            },
                        )}
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
                {detail?.next_step ? (
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
                {!!detail?.next_step ? (
                    <Form.Item label="Next Step">
                        <Space.Compact>
                            <Input value={visaProcess[detail.documents.length]} />
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
    );
}
