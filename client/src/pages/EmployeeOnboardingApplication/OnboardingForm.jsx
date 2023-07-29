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
    List,
} from "antd";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
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
    const [uploadedfileList, setUploadedfileList] = useState([]);
    const beforeUpload = (file) => {
        // Check if the number of uploaded files has reached the limit (e.g., 1 in this example)
        if (uploadedfileList.length >= 1) {
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
    // const handleFileChange = (event) => {
    //   setSelectedFile(event.target.files[0]);
    // };

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
                content: btoa(
                    String.fromCharCode.apply(null, uint8ArrayFileContent)
                ), // Convert the ArrayBuffer to a Buffer
                size: pdfFile.size,
                type: pdfFile.type,
                lastModified: pdfFile.lastModified,
                document_type: "OPT RECEIPT", // The mv function is specific to the backend implementation, not relevant here
            };

            // // Use the file details here, or log it to the console
            // setSelectedFile(fileDetails);
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
                    url: pdfUrl, // Use the uploaded file URL here
                    thumbUrl: pdfUrl,
                    details: fileDetails,
                },
            ];
            setUploadedfileList(newFileList);
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
        const newFileList = uploadedfileList.filter(
            (item) => item.uid !== file.uid
        );
        setUploadedfileList(newFileList);
    };
    const handleSubmit = () => {
        dispatch(
            uploadDocumentAction({
                id: employee._id,
                document: setSelectedFile,
            })
        );
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
                        name={["name", "first_name"]}
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
                        name={["name", "last_name"]}
                        rules={[
                            {
                                required: true,
                                message: "Please enter your last name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Middle Name" name="middle_name">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Preferred Name" name="preferred_name">
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
                        label="Street Name"
                        name={["address", "street_name"]} // Use an array for nested fields
                        rules={[
                            {
                                required: true,
                                message: "Please enter your street name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Building / Apt"
                        name={["address", "building_apt"]} // Use an array for nested fields
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please enter your building or apt number",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="City" name={["address", "city"]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="State" name={["address", "state"]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="ZIP" name={["address", "zip"]}>
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
                        <Input disabled value={employee.email} />
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
                                    <Form.Item
                                        label="Upload PDF File"
                                        name="pdfFile"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            } else if (e && e.fileList) {
                                                // Filter the fileList to contain only one file
                                                const filteredFileList =
                                                    e.fileList.slice(0, 0);
                                                return filteredFileList;
                                            }
                                            return [];
                                        }}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please upload a PDF file",
                                            },
                                        ]}
                                    >
                                        <div>
                                            {" "}
                                            {/* Use a div as a wrapper */}
                                            <Upload.Dragger
                                                name="pdfFile"
                                                accept=".pdf"
                                                multiple={false}
                                                beforeUpload={beforeUpload}
                                                customRequest={handleFileUpload}
                                                fileList={uploadedfileList}
                                                onChange={handleFileChange}
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <InboxOutlined />
                                                </p>
                                                <p className="ant-upload-text">
                                                    Click or drag a PDF file to
                                                    this area to upload
                                                </p>
                                                <p className="ant-upload-hint">
                                                    Support for a single or bulk
                                                    upload.
                                                </p>
                                            </Upload.Dragger>
                                            {uploadedfileList.map((file) => (
                                                <div key={file.uid}>
                                                    <a
                                                        href={file.url}
                                                        download={file.name}
                                                    ></a>
                                                    <DeleteOutlined
                                                        onClick={() =>
                                                            handleFileRemove(
                                                                file
                                                            )
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </Form.Item>

                                    {/* <div>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                        <button onClick={handleFileUpload}>
                                            Upload PDF
                                        </button>
                                    </div> */}
                                    {/* <Form.Item>
                                        {employee.pdfFileUrl && (
                                            <Button
                                                onClick={handleDownloadFile}
                                                type="primary"
                                            >
                                                Download Uploaded File
                                            </Button>
                                        )}
                                    </Form.Item> */}
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
                                <Button
                                    onClick={() => add()}
                                    style={{
                                        display: "flex",
                                        justifyContent: "left",
                                        alignItems: "center",
                                    }}
                                >
                                    Add Emergency Contact
                                </Button>
                            </>
                        )}
                    </Form.List>

                    {/* Add summary of uploaded files or documents */}
                    {/* ... */}
                    <List
                        header={<div>Summary of Uploaded Files</div>}
                        bordered
                        dataSource={uploadedfileList}
                        renderItem={(file) => (
                            <List.Item
                                actions={[
                                    <a href={file.url} download={file.name}>
                                        Download
                                    </a>,
                                    <DeleteOutlined
                                        onClick={() => handleFileRemove(file)}
                                    />,
                                ]}
                            >
                                {file.name}
                            </List.Item>
                        )}
                    />

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={handleSubmit}
                        >
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
