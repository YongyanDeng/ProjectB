import React from "react";
import { Form, Input, Button, Select, Upload, message, Typography, DatePicker, List } from "antd";
import dayjs from "dayjs";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import style from "./onboardingForm.module.css";
import {
    fetchEmployeeAction,
    updateEmployeeAction,
    setOnboardingApplication,
    uploadDocumentAction,
} from "app/employeeSlice";
import { useEffect, useState } from "react";
const { Option } = Select;
const OnboardingForm = ({ employee, title, onboardingStatus, isDisabled }) => {
    const dispatch = useDispatch();
    // const { employee } = useSelector((state) => state.employee);
    const [imageUrl, setImageUrl] = useState("");
    const [selectedDate, setSelectedDate] = useState({
        work_authorization: { start_date: "", end_date: "" },
    });

    // useEffect(() => {
    //     if (
    //         onboardingStatus !== "Never submitted" &&
    //         onboardingStatus !== "rejected"
    //     ) {
    //         setIsDisabled(true);
    //     }
    // }, []);
    const handleImageLinkChange = (e) => {
        setImageUrl(e.target.value);
    };

    const handleUsCitizenChange = (value) => {
        // Update the onboardingApplication with the selected value for usCitizen
        dispatch(
            setOnboardingApplication({
                ...employee,
                usCitizen: value,
            }),
        );
    };

    const handleWorkAuthorization = (value) => {
        // Update the onboardingApplication with the selected value for usCitizen

        dispatch(
            setOnboardingApplication({
                ...employee,
                work_authorization: {
                    ...employee.work_authorization,
                    title: value,
                },
            }),
        );
    };
    const handleDateChange = (date, name) => {
        // Update the onboardingApplication with the selected value for startDate

        const dateString = date ? dayjs(date).format("MMMM D, YYYY, h:mm A") : null;
        setSelectedDate({
            work_authorization: {
                ...selectedDate.work_authorization,
                [name]: dateString,
            },
        });
    };
    const handleEndDateChange = (date) => {
        // Update the onboardingApplication with the selected value for startDate

        const endDateString = date ? dayjs(date).format("MMMM D, YYYY, h:mm A") : null;

        dispatch(
            setOnboardingApplication({
                ...employee,
                work_authorization: { end_date: endDateString },
            }),
        );
    };

    const disabledEndDate = (current) => {
        const startDate = selectedDate.work_authorization.start_date;
        if (!current || !startDate) {
            return false;
        }
        const currentString = dayjs(current).format("MMMM D, YYYY, h:mm A");

        return dayjs(currentString).isBefore(startDate);
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
                content: btoa(String.fromCharCode.apply(null, uint8ArrayFileContent)), // Convert the ArrayBuffer to a Buffer
                size: pdfFile.size,
                type: pdfFile.type,
                lastModified: pdfFile.lastModified,
                document_type: "OPT RECEIPT", // The mv function is specific to the backend implementation, not relevant here
            };

            // // Use the file details here, or log it to the console
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
        const newFileList = uploadedfileList.filter((item) => item.uid !== file.uid);
        setUploadedfileList(newFileList);
    };
    const fullOuterJoinObjects = (obj1, obj2) => {
        const result = {};

        // Merge properties from obj1
        for (const key in obj1) {
            if (obj1.hasOwnProperty(key)) {
                if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
                    // If both properties are objects, recursively merge the nested fields
                    result[key] = fullOuterJoinObjects(obj1[key], obj2[key]);
                } else {
                    // Otherwise, use the property from obj1
                    result[key] = obj1[key];
                }
            }
        }

        // Merge properties from obj2, overwriting properties from obj1
        for (const key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                if (typeof obj2[key] === "object") {
                    // If obj2[key] is an object and obj1[key] is not, set it directly
                    result[key] = obj2[key];
                } else if (!obj1.hasOwnProperty(key)) {
                    // If obj1 doesn't have the property, set it from obj2
                    result[key] = obj2[key];
                }
            }
        }

        return result;
    };
    const handleSaveForm = (data) => {
        const savedEmployee = { ...employee };
        console.log("show data", data);
        console.log("show employee", savedEmployee);
        // data.work_authorization.end_date=data.work_authorization.end_date.toISOString();
        const savedData = Object.assign({}, savedEmployee, data);
        console.log("show saved data", savedData);
        console.log("show selectedDate", selectedDate);
        const finalData = {
            ...savedData,
            work_authorization: {
                title: savedData.work_authorization.title,
                start_date: selectedDate.work_authorization.start_date,
                end_date: selectedDate.work_authorization.end_date,
            },
        };
        console.log("show final data", finalData);
        dispatch(updateEmployeeAction({ id: employee._id, employee: finalData }));
        message.success("Form data saved successfully!");
    };

    const handleSubmit = () => {
        dispatch(
            uploadDocumentAction({
                id: employee._id,
                document: selectedFile,
            }),
        );
        dispatch(
            updateEmployeeAction({
                id: employee._id,
                employee: { onboarding_status: "Pending" },
            }),
        );
    };
    // const inputStyles = {
    //     color: isDisabled ? "red" : "black",
    // };

    const fields = [
        {
            label: "First Name",
            name: ["name", "first_name"],
            type: "input text",
            rules: [
                {
                    required: true,
                    message: "Please enter your first name",
                },
            ],
        },
        {
            label: "Last Name",
            name: ["name", "last_name"],
            type: "input text",
            rules: [
                {
                    required: true,
                    message: "Please enter your first name",
                },
            ],
        },
        {
            label: "Last Name",
            name: ["name", "last_name"],
            type: "input text",
            rules: [
                {
                    required: true,
                    message: "Please enter your last name",
                },
            ],
        },
        {
            label: "Middle Name",
            name: ["name", "middle_name"],
            type: "input text",
        },
        {
            label: "Profile Picture",
            name: ["name", "profile_picture"],
            type: "input text",
        },
    ];

    return (
        <div className={style.FormBox}>
            <div className={style.topContent}>
                <Typography.Title level={2} className={style.title}>
                    {title}
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
                    onFinish={handleSaveForm}
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
                        <Input disabled={isDisabled} />
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
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item label="Middle Name" name={["name", "middle_name"]}>
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item label="Preferred Name" name={["name", "preferred_name"]}>
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item label="Profile Picture" name="profile_picture">
                        <Input
                            id="image-link-input"
                            placeholder="Profile Picture"
                            onChange={handleImageLinkChange}
                            disabled={isDisabled}
                        />
                    </Form.Item>

                    <Form.Item>
                        <img
                            src={imageUrl ? imageUrl : employee.profile_picture}
                            style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                            }}
                            alt="Image"
                        />
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
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item
                        label="Building / Apt"
                        name={["address", "building_apt"]} // Use an array for nested fields
                        rules={[
                            {
                                required: true,
                                message: "Please enter your building or apt number",
                            },
                        ]}
                    >
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item
                        label="City"
                        name={["address", "city"]}
                        rules={[
                            {
                                required: true,
                                message: "Please enter the city",
                            },
                        ]}
                    >
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item
                        label="State"
                        name={["address", "state"]}
                        rules={[
                            {
                                required: true,
                                message: "Please enter the state",
                            },
                        ]}
                    >
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item
                        label="ZIP"
                        name={["address", "zip"]}
                        rules={[
                            {
                                required: true,
                                message: "Please enter the ZIP",
                            },
                        ]}
                    >
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item
                        label="Cell Phone Number"
                        name={["contact_info", "cell_phone"]}
                        rules={[
                            {
                                required: true,
                                message: "Please enter your cell phone number",
                            },
                        ]}
                    >
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item label="Work Phone Number" name={["contact_info", "work_phone"]}>
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input disabled value={employee.email} />
                    </Form.Item>
                    <Form.Item
                        label="SSN"
                        name={["identification_info", "SSN"]}
                        rules={[
                            {
                                required: true,
                                message: "Please enter your SSN",
                            },
                        ]}
                    >
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item
                        label="Date of Birth"
                        name={["identification_info", "date_of_birth"]}
                        rules={[
                            {
                                required: true,
                                message: "Please enter your date of birth",
                            },
                        ]}
                    >
                        <Input disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item
                        label="Gender"
                        name={["identification_info", "gender"]}
                        rules={[
                            {
                                required: true,
                                message: "Please enter your gender",
                            },
                        ]}
                    >
                        <Select disabled={isDisabled}>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">I do not wish to answer</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Permanent resident or citizen of the U.S.?" name="usCitizen">
                        <Select onChange={handleUsCitizenChange} disabled={isDisabled}>
                            <Option value="yes">Yes</Option>
                            <Option value="no">No</Option>
                        </Select>
                    </Form.Item>
                    {employee.usCitizen === "yes" && (
                        <Form.Item
                            label="What is your work authorization?"
                            name={["work_authorization", "title"]}
                        >
                            <Select
                                value={employee.work_authorization.title}
                                onChange={handleWorkAuthorization}
                                disabled={isDisabled}
                            >
                                <Option value="Green Card">Green Card</Option>
                                <Option value="Citizen">Citizen</Option>
                            </Select>
                        </Form.Item>
                    )}
                    {employee.usCitizen === "no" && (
                        <div>
                            <Form.Item
                                label="What is your work authorization?"
                                name={["work_authorization", "title"]}
                            >
                                <Select onChange={handleWorkAuthorization} disabled={isDisabled}>
                                    <Option value="H1-B">H1-B</Option>
                                    <Option value="L2">L2</Option>
                                    <Option value="F1(CPT/OPT)">F1(CPT/OPT)</Option>
                                    <Option value="H4">H4</Option>
                                    <Option value="Other">Other</Option>
                                </Select>
                            </Form.Item>

                            {employee.work_authorization?.title === "F1(CPT/OPT)" && (
                                <div>
                                    <Form.Item
                                        label="Upload PDF File"
                                        name="pdfFile"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            } else if (e && e.fileList) {
                                                // Filter the fileList to contain only one file
                                                const filteredFileList = e.fileList.slice(0, 0);
                                                return filteredFileList;
                                            }
                                            return [];
                                        }}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             "Please upload a PDF file",
                                        //     },
                                        // ]}
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
                                                    Click or drag a PDF file to this area to upload
                                                </p>
                                                <p className="ant-upload-hint">
                                                    Support for a single or bulk upload.
                                                </p>
                                            </Upload.Dragger>
                                            {uploadedfileList.map((file) => (
                                                <div key={file.uid}>
                                                    <a href={file.url} download={file.name}></a>
                                                    <DeleteOutlined
                                                        onClick={() => handleFileRemove(file)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </Form.Item>
                                </div>
                            )}

                            {employee.work_authorization?.title === "Other" && (
                                <Form.Item
                                    label="Specify Visa Title"
                                    name={["work_authorization", "title"]}
                                >
                                    <Input disabled={isDisabled} />
                                </Form.Item>
                            )}

                            <Form.Item
                                // name={["work_authorization", "start_date"]}
                                label="Start Date"
                            >
                                <DatePicker
                                    disabled={isDisabled}
                                    value={
                                        selectedDate.work_authorization.start_date
                                            ? dayjs(selectedDate.work_authorization.start_date)
                                            : null
                                    }
                                    onChange={(date) => handleDateChange(date, "start_date")}
                                />
                            </Form.Item>

                            <Form.Item
                                label="End Date"
                                // name={["work_authorization", "end_date"]}
                            >
                                <DatePicker
                                    disabled={isDisabled}
                                    value={
                                        selectedDate.work_authorization.end_date
                                            ? dayjs(selectedDate.work_authorization.end_date)
                                            : null
                                    }
                                    onChange={(date) => handleDateChange(date, "end_date")}
                                    disabledDate={disabledEndDate}
                                />
                            </Form.Item>
                        </div>
                    )}
                    <Form.Item label="Reference">
                        <Form.Item
                            name={["reference", "referee_info", "first_name"]}
                            label="First Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your reference first name",
                                },
                            ]}
                        >
                            <Input disabled={isDisabled} />
                        </Form.Item>
                        <Form.Item
                            name={["reference", "referee_info", "last_name"]}
                            label="Last Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your reference last name",
                                },
                            ]}
                        >
                            <Input disabled={isDisabled} />
                        </Form.Item>
                        <Form.Item
                            name={["reference", "referee_info", "middle_name"]}
                            label="Middle Name"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name={["reference", "referee_info", "phone"]} label="Phone">
                            <Input />
                        </Form.Item>
                        <Form.Item name={["reference", "referee_info", "email"]} label="Email">
                            <Input disabled={isDisabled} />
                        </Form.Item>
                        <Form.Item
                            name={["reference", "referee_info", "relationship"]}
                            label="Relationship"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your reference relationship",
                                },
                            ]}
                        >
                            <Input disabled={isDisabled} />
                        </Form.Item>
                    </Form.Item>
                    {/* Emergency Contacts */}
                    <Form.Item label="Emergency Contact">
                        <Form.Item
                            name={["reference", "emergency_contact", "first_name"]}
                            label="First Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your reference first name",
                                },
                            ]}
                        >
                            <Input disabled={isDisabled} />
                        </Form.Item>
                        <Form.Item
                            name={["reference", "emergency_contact", "last_name"]}
                            label="Last Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your reference last name",
                                },
                            ]}
                        >
                            <Input disabled={isDisabled} />
                        </Form.Item>
                        <Form.Item
                            name={["reference", "emergency_contact", "middle_name"]}
                            label="Middle Name"
                        >
                            <Input disabled={isDisabled} />
                        </Form.Item>
                        <Form.Item name={["reference", "emergency_contact", "phone"]} label="Phone">
                            <Input disabled={isDisabled} />
                        </Form.Item>
                        <Form.Item name={["reference", "emergency_contact", "email"]} label="Email">
                            <Input disabled={isDisabled} />
                        </Form.Item>
                        <Form.Item
                            name={["reference", "emergency_contact", "relationship"]}
                            label="Relationship"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your emergency contact relationship",
                                },
                            ]}
                        >
                            <Input disabled={isDisabled} />
                        </Form.Item>
                    </Form.Item>

                    {/* Add summary of uploaded files or documents */}
                    {/* ... */}
                    <List
                        header={<div>Summary of Uploaded Files</div>}
                        bordered
                        dataSource={uploadedfileList}
                        renderItem={(file) => (
                            <List.Item
                                actions={[
                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                        Preview
                                    </a>,
                                    <a href={file.url} download={file.name}>
                                        Download
                                    </a>,
                                    !isDisabled && (
                                        <DeleteOutlined onClick={() => handleFileRemove(file)} />
                                    ),
                                ]}
                            >
                                {file.name}
                            </List.Item>
                        )}
                    />
                    {(onboardingStatus === "Never submitted" ||
                        onboardingStatus === "rejected") && (
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                save
                            </Button>
                            <Button style={{ marginLeft: 10 }} onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </div>
        </div>
    );
};

export default OnboardingForm;

<OnboardingForm />;
