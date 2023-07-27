import React from "react";
import {
    Form,
    Input,
    Button,
    Select,
    Upload,
    message,
    Typography,
    DatePicker,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import style from "./onboardingForm.module.css";
import {
    setOnboardingApplication,
    uploadDocumentAction,
} from "app/employeeSlice";
import { useEffect, useState } from "react";
const { Option } = Select;
const OnboardingForm = () => {
    const dispatch = useDispatch();
    const { employee, onboardingApplication } = useSelector(
        (state) => state.employee
    );
    const [savedonboardingApplication, setSavedonboardingApplication] =
        useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

    const onFinish = (values) => {
        // dispatch(fetchEmployeeAction(values));
        // dispatch(setOnboardingStatus("pending"));
        message.success("Application submitted successfully!");
    };

    const handleUsCitizenChange = (value) => {
        // Update the onboardingApplication with the selected value for usCitizen
        dispatch(
            setOnboardingApplication({
                ...onboardingApplication,
                usCitizen: value,
            })
        );
    };
    const handleSaveForm = () => {
        // Save the form data to the local state
        setSavedonboardingApplication(employee);
        message.success("Form data saved successfully!");
    };

    const handleWorkAuthorization = (value) => {
        // Update the onboardingApplication with the selected value for usCitizen
        dispatch(
            setOnboardingApplication({
                ...onboardingApplication,
                workAuthorization: value,
            })
        );
    };
    const handleStartDateChange = (date) => {
        // Update the onboardingApplication with the selected value for startDate
        dispatch(
            setOnboardingApplication({
                ...onboardingApplication,
                startDate: date,
            })
        );
    };
    // Function to disable dates earlier than the start date
    const disabledEndDate = (current) => {
        const startDate = onboardingApplication.startDate;
        if (!current || !startDate) {
            return false;
        }
        return current < startDate;
    };

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    // const handleFileChange = (event) => {
    //   setSelectedFile(event.target.files[0]);
    // };

    const handleFileUpload = () => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }
        // e.target.result contains the file data as a Buffer
        const reader = new FileReader();

        reader.onload = (e) => {
            // e.target.result contains the file data as an ArrayBuffer
            const fileData = e.target.result;
            const uint8ArrayData = new Uint8Array(fileData);
            // Get the file details
            const fileDetails = {
                name: selectedFile.name,
                content: btoa(String.fromCharCode.apply(null, uint8ArrayData)), // Convert the ArrayBuffer to a Buffer
                size: selectedFile.size,
                type: selectedFile.type,
                lastModified: selectedFile.lastModified,
                document_type: "OPT RECEIPT", // The mv function is specific to the backend implementation, not relevant here
            };

            // Use the file details here, or log it to the console
            dispatch(
                uploadDocumentAction({
                    id: employee._id,
                    document: fileDetails,
                })
            );
        };

        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(selectedFile);
    };

    //     // Make a fetch POST request to the server
    //     fetch(`http://localhost:8080/api/employees/${employee._id}/documents`, {
    //         method: "POST",
    //         body: formData,
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log("File upload success:", data);
    //             // Do something with the server response if needed
    //         })
    //         .catch((error) => {
    //             console.error("File upload error:", error);
    //             // Handle the error if needed
    //         });
    // };

    // const handleFileUpload = () => {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         // e.target.result contains the file data as a Buffer
    //         const fileData = e.target.result;

    //         // Create a new FormData object
    //         const formData = new FormData();
    //         formData.append("pdfFile", new Blob([fileData]), file.name);

    //         const defaultHeaders = {
    //             "Content-Type": "multipart/form-data",
    //         };

    //         if (localStorage.getItem("token")) {
    //             defaultHeaders[
    //                 "Authorization"
    //             ] = `Bearer ${localStorage.getItem("token")}`;
    //         }

    //         // Make a fetch POST request to the server
    //         fetch(
    //             `http://localhost:8080/api/employees/${employee._id}/documents`,
    //             {
    //                 method: "POST",
    //                 body: formData,
    //                 headers: defaultHeaders,
    //             }
    //         )
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 // Handle the server response here if needed
    //                 console.log("File upload success:", data);
    //             })
    //             .catch((error) => {
    //                 console.error("File upload error:", error);
    //             });
    //     };
    //     reader.readAsArrayBuffer(file);
    // };
    const handleDownloadFile = () => {
        // Assume the uploaded file URL is stored in the onboardingApplication under the key "pdfFileUrl"
        const { pdfFileUrl } = onboardingApplication;
        if (pdfFileUrl) {
            // Trigger download by creating an anchor element
            const link = document.createElement("a");
            link.href = pdfFileUrl;
            link.download = "uploaded_file.pdf"; // Set the default file name for download
            link.click();
        } else {
            message.error("No file uploaded to download.");
        }
    };

    return (
        <div className={style.FormBox}>
            <div className={style.topContent}>
                <Typography.Title level={2} className={style.title}>
                    Onboarding application
                </Typography.Title>
            </div>
            <div
                style={{
                    backgroundColor: "#FFF",
                    width: "100%",
                    padding: "5px",
                    textAlign: "center",
                }}
            >
                <Form
                    initialValues={employee}
                    onFinish={onFinish}
                    layout="vertical"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Form.Item
                        label="First Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your first name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your last name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Middle Name">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Preferred Name">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Profile Picture"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.fileList;
                        }}
                    >
                        <Upload.Dragger name="files">
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload.
                            </p>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item
                        label="Current Address"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your current address",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Cell Phone Number"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your cell phone number",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Work Phone Number">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Email">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="SSN">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Date of Birth">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Gender" name="gender">
                        <Select>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">
                                I do not wish to answer
                            </Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Permanent resident or citizen of the U.S.?">
                        <Select onChange={handleUsCitizenChange}>
                            <Option value="yes">Yes</Option>
                            <Option value="no">No</Option>
                        </Select>
                    </Form.Item>

                    {onboardingApplication.usCitizen === "no" && (
                        <div>
                            <Form.Item label="What is your work authorization?">
                                <Select onChange={handleWorkAuthorization}>
                                    <Option value="H1-B">H1-B</Option>
                                    <Option value="L2">L2</Option>
                                    <Option value="F1(CPT/OPT)">
                                        F1(CPT/OPT)
                                    </Option>
                                    <Option value="H4">H4</Option>
                                    <Option value="Other">Other</Option>
                                </Select>
                            </Form.Item>

                            {onboardingApplication.workAuthorization ===
                                "F1(CPT/OPT)" && (
                                <div>
                                    {/* <Form.Item
                                        label="Upload PDF File"
                                        name="pdfFile"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) =>
                                            Array.isArray(e)
                                                ? e
                                                : e && e.fileList
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please upload a PDF file",
                                            },
                                        ]}
                                    >
                                        <Upload.Dragger
                                            name="pdfFile"
                                            accept=".pdf"
                                            customRequest={({
                                                file,
                                                onSuccess,
                                                onError,
                                            }) => {
                                                // Read the file data as a Buffer
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    // e.target.result contains the file data as a Buffer
                                                    const fileData =
                                                        e.target.result;

                                                    // Create a new FormData object
                                                    const formData =
                                                        new FormData();
                                                    formData.append(
                                                        "pdfFile",
                                                        new Blob([fileData]),
                                                        file.name
                                                    );

                                                    const defaultHeaders = {
                                                        "Content-Type":
                                                            "application/json",
                                                    };

                                                    if (
                                                        localStorage.getItem(
                                                            "token"
                                                        )
                                                    ) {
                                                        defaultHeaders[
                                                            "Authorization"
                                                        ] = `Bearer ${localStorage.getItem(
                                                            "token"
                                                        )}`;
                                                    }

                                                    // Make a fetch POST request to the server
                                                    fetch(
                                                        `http://localhost:8080/api/employees/${employee._id}/documents`,
                                                        {
                                                            method: "POST",
                                                            body: formData,
                                                            headers:
                                                                defaultHeaders,
                                                        }
                                                    )
                                                        .then((response) =>
                                                            response.json()
                                                        )
                                                        .then((data) => {
                                                            // Handle the server response here if needed
                                                            console.log(
                                                                "File upload success:",
                                                                data
                                                            );
                                                            onSuccess(data);
                                                        })
                                                        .catch((error) => {
                                                            console.error(
                                                                "File upload error:",
                                                                error
                                                            );
                                                            onError(error);
                                                        });
                                                };
                                                reader.readAsArrayBuffer(file);
                                            }}
                                            onChange={handleFileChange}
                                        >
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">
                                                Click or drag a PDF file to this
                                                area to upload
                                            </p>
                                            <p className="ant-upload-hint">
                                                Support for a single or bulk
                                                upload.
                                            </p>
                                        </Upload.Dragger>
                                    </Form.Item> */}

                                    <div>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                        <button onClick={handleFileUpload}>
                                            Upload PDF
                                        </button>
                                    </div>
                                    <Form.Item>
                                        {employee.pdfFileUrl && (
                                            <Button
                                                onClick={handleDownloadFile}
                                                type="primary"
                                            >
                                                Download Uploaded File
                                            </Button>
                                        )}
                                    </Form.Item>
                                </div>
                            )}

                            {onboardingApplication.workAuthorization ===
                                "Other" && (
                                <Form.Item label="Specify Visa Title">
                                    <Input />
                                </Form.Item>
                            )}

                            <Form.Item label="Start Date">
                                <DatePicker onChange={handleStartDateChange} />
                            </Form.Item>

                            <Form.Item label="End Date">
                                <DatePicker disabledDate={disabledEndDate} />
                            </Form.Item>
                        </div>
                    )}

                    <Form.Item label="Reference">
                        <Form.Item
                            name={["reference", "first_name"]}
                            label="First Name"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={["reference", "last_name"]}
                            label="Last Name"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={["reference", "middle_name"]}
                            label="Middle Name"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name={["reference", "phone"]} label="Phone">
                            <Input />
                        </Form.Item>
                        <Form.Item name={["reference", "email"]} label="Email">
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={["reference", "relationship"]}
                            label="Relationship"
                        >
                            <Input />
                        </Form.Item>
                    </Form.Item>

                    {/* Emergency Contacts */}
                    <Form.List name="emergency_contacts">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <div key={field.key}>
                                        <Form.Item
                                            label={`Emergency Contact ${
                                                index + 1
                                            }`}
                                        >
                                            <Form.Item
                                                name={[
                                                    field.name,
                                                    "first_name",
                                                ]}
                                                label="First Name"
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                name={[field.name, "last_name"]}
                                                label="Last Name"
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                name={[
                                                    field.name,
                                                    "middle_name",
                                                ]}
                                                label="Middle Name"
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                name={[field.name, "phone"]}
                                                label="Phone"
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                name={[field.name, "email"]}
                                                label="Email"
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                name={[
                                                    field.name,
                                                    "relationship",
                                                ]}
                                                label="Relationship"
                                            >
                                                <Input />
                                            </Form.Item>
                                            {fields.length > 1 && (
                                                <Button
                                                    onClick={() =>
                                                        remove(field.name)
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </Form.Item>
                                    </div>
                                ))}
                                <Button onClick={() => add()}>
                                    Add Emergency Contact
                                </Button>
                            </>
                        )}
                    </Form.List>

                    {/* Add summary of uploaded files or documents */}
                    {/* ... */}

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button
                            style={{ marginLeft: 10 }}
                            onClick={handleSaveForm}
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default OnboardingForm;
