import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Upload, Typography, Table, Button, message } from "antd";
import { FilePdfOutlined, InboxOutlined } from "@ant-design/icons";
import {
    fetchEmployeeAction,
    uploadDocumentAction,
    fetchDocumentsAction,
    deleteDocumentAction,
} from "app/employeeSlice";
export default function EmployeeVisa() {
    const dispatch = useDispatch();
    const { employee, status, documents } = useSelector((state) => state.employee);
    const [detail, setDetail] = useState(null);
    const [selectedFile, setSelectedFile] = useState({ uid: "" });
    const [uploadedfileList, setUploadedfileList] = useState([]);
    const visaProcess = ["OPT RECEIPT", "OPT EAD", "I-983", "I-20"];
    useEffect(() => {
        dispatch(fetchEmployeeAction(employee.id));
        dispatch(fetchDocumentsAction(employee.id));
    }, []);
    useEffect(() => {
        if (status === "successed") {
            if (documents?.length) {
                let docs = [];
                let index = 0;
                for (const file_type of visaProcess) {
                    const doc = documents.find((element) => element.document_type === file_type);
                    if (doc) {
                        docs.push({
                            key: index + 1,
                            name: doc.document_name,
                            content: doc.content.data,
                            type: doc.document_type,
                            status: doc.document_status,
                            feedback: doc,
                        });
                        index++;
                    }
                }

                let next_step = null;
                let message = "";
                // Determine the next step in the visa process
                const last = documents[documents.length - 1];
                if (last?.document_status !== "approved") {
                    next_step = visaProcess[Math.min(3, documents.length - 1)];
                } else if (documents.length < 4) {
                    next_step = visaProcess[documents.length];
                }

                // Generate a message based on the status of the last document
                const { document_type, document_status, feedback } = last;
                if (document_type === "OPT RECEIPT") {
                    if (document_status === "pending") {
                        message = "Waiting for HR to approve your OPT Receipt";
                    } else if (document_status === "approved") {
                        message = "Please upload a copy of your OPT EAD";
                    } else if (document_status === "rejected") {
                        message = feedback;
                    }
                } else if (document_type === "OPT EAD") {
                    if (document_status === "pending") {
                        message = "Waiting for HR to approve your OPT EAD";
                    } else if (document_status === "approved") {
                        message = "Please download and fill out the I-983 form";
                    } else if (document_status === "rejected") {
                        message = feedback;
                    }
                } else if (document_type === "I-983") {
                    if (document_status === "pending") {
                        message = "Waiting for HR to approve and sign your I-983";
                    } else if (document_status === "approved") {
                        message =
                            "Please send the I-983 along with all necessary documents to your school and upload the new I-20";
                    } else if (document_status === "rejected") {
                        message = feedback;
                    }
                } else if (document_type === "I-20") {
                    if (document_status === "pending") {
                        message = "Waiting for HR to approve your I-20";
                    } else if (document_status === "approved") {
                        message = "All documents have been approved";
                    } else if (document_status === "rejected") {
                        message = feedback;
                    }
                }
                setDetail({
                    documents: docs,
                    next_step,
                    last,
                    message,
                });
            }
        }
    }, [documents]);

    const beforeUpload = (file) => {
        // Check if the number of uploaded files has reached the limit (e.g., 1 in this example)
        if (Object.keys(selectedFile).length > 1) {
            message.error("You can only upload one file.");
            return false; // Prevent further file upload
        }
        return true; // Allow file upload
    };

    const handleFileChange = (info) => {
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleFileUpload = ({ file, onSuccess, onError }) => {
        console.log("file", file.name);
        const pdfFile = file;
        if (!pdfFile) {
            alert("Please select a file to upload.");
            return;
        }
        // e.target.result contains the file data as a Buffer
        const reader = new FileReader();

        reader.onload = (e) => {
            // e.target.result contains the file data as an ArrayBuffer
            const fileData = e.target.result;
            const uint8ArrayFileContent = new Uint8Array(fileData);
            // Get the file details
            const fileDetails = {
                name: pdfFile.name,
                content: btoa(String.fromCharCode.apply(null, uint8ArrayFileContent)), // Convert the ArrayBuffer to a Buffer
                size: pdfFile.size,
                type: pdfFile.type,
                lastModified: pdfFile.lastModified,
                document_type: "OPT RECEIPT",
                uid: pdfFile.uid, // The mv function is specific to the backend implementation, not relevant here
            };

            // Use the file details here, or log it to the console
            setSelectedFile(fileDetails);
            const pdfBlob = new Blob([fileData], {
                type: "application/pdf",
            });

            const pdfUrl = URL.createObjectURL(pdfBlob);
            console.log("url link", pdfUrl);

            const newFileList = [
                {
                    uid: pdfFile.uid,
                    name: pdfFile.name,
                    status: "done",
                    file_url: pdfUrl, // Use the uploaded file URL here
                    thumbUrl: pdfUrl,
                    document_type: "OPT RECEIPT",
                    contentType: pdfFile.type,
                    fromDocuments: "no",
                },
            ];
            setUploadedfileList((uploadedfileList) => [...uploadedfileList, ...newFileList]);
            onSuccess();
        };

        reader.onerror = () => {
            message.error("Failed to upload file.");
            onError();
        };
        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(pdfFile);
    };

    const handleFileRemove = (file) => {
        const newFileList = uploadedfileList.filter((item) => item.uid !== file.uid);
        setUploadedfileList(newFileList);
        if (file.fromDocuments === "yes") {
            dispatch(deleteDocumentAction({ id: employee.id, documentId: file.id }));
            setSelectedFile({ uid: "" });
        }
    };

    const handleSubmit = async () => {
        try {
            dispatch(uploadDocumentAction({ id: employee.id, document: selectedFile }));

            message.success("file submitted successfully!");
        } catch (err) {
            console.error(err);
        }
    };

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

    return status === "successed" && employee?.work_authorization?.title === "F1(CPT/OPT)" ? (
        <div className="center-wrapper">
            <Typography.Title level={2} className="title">
                Visa Management
            </Typography.Title>
            <Table dataSource={detail?.documents} columns={columns} />
            {detail?.message && <h1>{detail.message}</h1>}
            {detail?.next_step && detail.next_step === "I-983" && (
                <div>
                    <div>
                        {" "}
                        <a href="https://www.ice.gov/doclib/sevis/pdf/i983.pdf" download>
                            Empty I-983 Template
                        </a>
                    </div>
                    <div>
                        {" "}
                        <a
                            href="https://isss.utah.edu/forms-publications/documents/f1-form-i-983-sample.pdf"
                            download
                        >
                            Sample I-983 PDF Download
                        </a>
                    </div>
                </div>
            )}
            {detail?.next_step && detail?.last && detail.last.document_status !== "pending" && (
                <div>
                    {" "}
                    <Upload.Dragger
                        name="pdfFile"
                        accept=".pdf"
                        multiple={false}
                        beforeUpload={beforeUpload}
                        customRequest={handleFileUpload}
                        fileList={[selectedFile]}
                        onChange={handleFileChange}
                        onRemove={handleFileRemove}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text"> Please upload {detail?.next_step}</p>
                        <p className="ant-upload-hint">Support for a single upload.</p>
                    </Upload.Dragger>
                    <Button style={{ marginLeft: 10 }} onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            )}
        </div>
    ) : employee?.work_authorization?.title === "F1(CPT/OPT)" ? (
        <h1>Loading</h1>
    ) : (
        <h1>Not applicable</h1>
    );
}
