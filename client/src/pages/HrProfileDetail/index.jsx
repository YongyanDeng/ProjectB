import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, Input, Table, Button, Select, Space, message } from "antd";
import { FilePdfOutlined, MailOutlined } from "@ant-design/icons";

import { getProfileDetail } from "app/hrSlice";

const visaProcess = ["OPT Receipt", "OPT EAD", "I-983", "I-20"];

export default function HrProfileDetail() {
    const dispatch = useDispatch();
    const { employeeId } = useParams();
    const { employee } = useSelector((state) => state.employee);
    const { selectedEmployee, status } = useSelector((state) => state.hr);
    const [detail, setDetail] = useState(null);
    const title = "Persoanl Profile (View Only)";

    useEffect(() => {
        dispatch(getProfileDetail({ id: employee.id, employeeId }));
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
                next_step = visaProcess[selectedEmployee.documents.length - 1];
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

    const fields = [
        // Name
        {
            name: "First Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "First Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Last Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Last Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Middle Name",
            type: "text",
        },
        {
            name: "Preferred Name",
            type: "text",
        },

        // Picture
        {
            name: "Profile Picture",
            type: "img",
        },

        // current_address
        {
            name: "Street",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Street CANNOT be empty",
                },
            ],
        },
        {
            name: "Building/Apt",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Building/Apt CANNOT be empty",
                },
            ],
        },
        {
            name: "City",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "City CANNOT be empty",
                },
            ],
        },
        {
            name: "State",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "State CANNOT be empty",
                },
            ],
        },
        {
            name: "Zip",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Zip CANNOT be empty",
                },
            ],
        },

        // contact_info
        {
            name: "Cell Phone Number",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Cell Phone Number CANNOT be empty",
                },
            ],
        },
        {
            name: "Work Phone Number",
            type: "text",
        },
        {
            name: "Email",
            type: "text",
        },

        // identificaion_info
        {
            name: "SSN",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "SSN CANNOT be empty",
                },
            ],
        },
        {
            name: "Date of Birth",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Date of Birth CANNOT be empty",
                },
            ],
        },
        {
            name: "Gender",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Gender CANNOT be empty",
                },
            ],
        },

        // work_authorization
        {
            name: "Title",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Title CANNOT be empty",
                },
            ],
        },
        {
            name: "Start Date",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Start Date CANNOT be empty",
                },
            ],
        },
        {
            name: "End Date",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "End Date CANNOT be empty",
                },
            ],
        },
        {
            name: "Days Remaining",
            type: "text",
        },

        // reference
        {
            name: "First Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "First Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Last Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Last Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Middle Name",
            type: "text",
        },
        {
            name: "Phone",
            type: "text",
        },
        {
            name: "Email",
            type: "text",
        },
        {
            name: "Relationship",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Relationship CANNOT be empty",
                },
            ],
        },

        // Emergency_contact
        {
            name: "First Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "First Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Last Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Last Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Middle Name",
            type: "text",
        },
        {
            name: "Phone",
            type: "text",
        },
        {
            name: "Email",
            type: "text",
        },
        {
            name: "Relationship",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Relationship CANNOT be empty",
                },
            ],
        },

        // onboarding_status
        {
            name: "Onboarding Status",
            type: "text",
        },
    ];

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

    return (
        <div>
            <Form>
                <Form.Item>
                    <Table dataSource={detail?.documents} columns={columns} />
                </Form.Item>
            </Form>
        </div>
    );
}
