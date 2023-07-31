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
    Popconfirm,
} from "antd";
import dayjs from "dayjs";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import style from "./style.module.css";
import {
    fetchEmployeeAction,
    updateEmployeeAction,
    setOnboardingApplication,
    uploadDocumentAction,
} from "app/employeeSlice";
import { useEffect, useState } from "react";

const { Option } = Select;

const EmployeeForm = ({ employee, personalInfo, title, onboardingStatus, enableEdit }) => {
    const dispatch = useDispatch();

    const [imageUrl, setImageUrl] = useState("");
    const [selectedDate, setSelectedDate] = useState({
        work_authorization: { start_date: "", end_date: "" },
    });
    const { message: errMessage } = useSelector((state) => state.error);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedfileList, setUploadedfileList] = useState([]);
    const [isDisable, setIsDisable] = useState(!enableEdit);
    const [saved, setSaved] = useState(false);

    // useEffect(() => {

    // }, [])

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
            }),
        );
    };

    const handleWorkAuthorization = (value) => {
        // Update the onboardingApplication with the selected value for usCitizen

        dispatch(
            setOnboardingApplication({
                ...employee,
                work_authorization: {
                    ...employee?.work_authorization,
                    title: value,
                },
            }),
            }),
        );
    };

    const handleDateChange = (date, name) => {
        // Update the onboardingApplication with the selected value for Date

        const dateString = date ? dayjs(date).format("MMMM D, YYYY, h:mm A") : null;
        const dateString = date ? dayjs(date).format("MMMM D, YYYY, h:mm A") : null;
        setSelectedDate({
            work_authorization: {
                ...selectedDate.work_authorization,
                [name]: dateString,
            },
        });
    };

    const disabledEndDate = (current) => {
        const startDate = selectedDate.work_authorization.start_date;
        if (!current || !startDate) {
            return false;
        }
        const currentString = dayjs(current).format("MMMM D, YYYY, h:mm A");

        return dayjs(currentString).isBefore(startDate);
    };

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
        const newFileList = uploadedfileList.filter((item) => item.uid !== file.uid);
        setUploadedfileList(newFileList);
    };

    const handleSaveForm = async (data) => {
        try {
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

            await dispatch(updateEmployeeAction({ id: employee?._id, employee: finalData }));
            if (!errMessage)
                await dispatch(uploadDocumentAction({ id: employee?._id, document: selectedFile }));
            if (personalInfo) {
                setIsDisable(() => true);
            }
            message.success("employee data saved successfully!");
            setSaved(() => true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = () => {
        if (saved) {
            dispatch(
                uploadDocumentAction({
                    id: employee?._id,
                    document: selectedFile,
                }),
            );
            dispatch(
                updateEmployeeAction({
                    id: employee?._id,
                    employee: { onboarding_status: "Pending" },
                }),
            );
            setIsDisable(true);
        } else {
            message.error("please save onboarding application before clicking submit");
        }
    };

    //for personal info

    const [popConfirmVisible, setPopConfirmVisible] = useState(false);

    const handleFirstCancelButton = () => {
        setPopConfirmVisible(true);
    };
    // Handler for confirming the action
    const handleConfirm = () => {
        // navigate to page before clicking edit
        // navigate("/");
        setPopConfirmVisible(false);
        setIsDisable(true);
        message.success("cancel all personal information changes");
    };

    // Handler for canceling the action
    const handleCancel = () => {
        setPopConfirmVisible(false);
        message.info("undo cancel");
    };

    const handleEdit = () => {
        setIsDisable(false);
    };

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
                        <Input disabled={isDisable} />
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
                        <Input disabled={isDisable} />
                    </Form.Item>
                    <Form.Item label="Middle Name" name={["name", "middle_name"]}>
                    <Form.Item label="Middle Name" name={["name", "middle_name"]}>
                        <Input disabled={isDisable} />
                    </Form.Item>
                    <Form.Item label="Preferred Name" name={["name", "preferred_name"]}>
                    <Form.Item label="Preferred Name" name={["name", "preferred_name"]}>
                        <Input disabled={isDisable} />
                    </Form.Item>
                    <Form.Item label="Profile Picture" name="profile_picture">
                        <Input
                            id="image-link-input"
                            placeholder="Profile Picture"
                            onChange={handleImageLinkChange}
                            disabled={isDisable}
                        />
                    </Form.Item>

                    <Form.Item>
                        <img
                            src={imageUrl ? imageUrl : employee?.profile_picture}
                            src={imageUrl ? imageUrl : employee?.profile_picture}
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
                        <Input disabled={isDisable} />
                    </Form.Item>
                    <Form.Item
                        label="Building / Apt"
                        name={["address", "building_apt"]} // Use an array for nested fields
                        rules={[
                            {
                                required: true,
                                message: "Please enter your building or apt number",
                                message: "Please enter your building or apt number",
                            },
                        ]}
                    >
                        <Input disabled={isDisable} />
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
                        <Input disabled={isDisable} />
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
                        <Input disabled={isDisable} />
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
                        <Input disabled={isDisable} />
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
                        <Input disabled={isDisable} />
                    </Form.Item>
                    <Form.Item label="Work Phone Number" name={["contact_info", "work_phone"]}>
                    <Form.Item label="Work Phone Number" name={["contact_info", "work_phone"]}>
                        <Input disabled={isDisable} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input disabled value={employee?.email} />
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
                        <Input disabled={isDisable} />
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
                        <Input disabled={isDisable} />
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
                        <Select disabled={isDisable}>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">I do not wish to answer</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Permanent resident or citizen of the U.S.?" name="usCitizen">
                        <Select onChange={handleUsCitizenChange} disabled={isDisable}>
                            <Option value="yes">Yes</Option>
                            <Option value="no">No</Option>
                        </Select>
                    </Form.Item>
                    {employee?.usCitizen === "yes" && (
                        <Form.Item
                            label="What is your work authorization?"
                            name={["work_authorization", "title"]}
                        >
                            <Select
                                value={employee?.work_authorization.title}
                                onChange={handleWorkAuthorization}
                                disabled={isDisable}
                            >
                                <Option value="Green Card">Green Card</Option>
                                <Option value="Citizen">Citizen</Option>
                            </Select>
                        </Form.Item>
                    )}
                    {employee?.usCitizen === "no" && (
                        <div>
                            <Form.Item
                                label="What is your work authorization?"
                                name={["work_authorization", "title"]}
                            >
                                <Select onChange={handleWorkAuthorization} disabled={isDisable}>
                                    <Option value="H1-B">H1-B</Option>
                                    <Option value="L2">L2</Option>
                                    <Option value="F1(CPT/OPT)">F1(CPT/OPT)</Option>
                                    <Option value="H4">H4</Option>
                                    <Option value="Other">Other</Option>
                                </Select>
                            </Form.Item>

                            {employee?.work_authorization?.title === "F1(CPT/OPT)" &&
                                !personalInfo && (
                                    <div>
                                        <Form.Item
                                            label="Upload OPT RECEIPT File"
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
                                                    disabled={isDisable}
                                                    beforeUpload={beforeUpload}
                                                    customRequest={handleFileUpload}
                                                    fileList={uploadedfileList}
                                                    onChange={handleFileChange}
                                                >
                                                    <p className="ant-upload-drag-icon">
                                                        <InboxOutlined />
                                                    </p>
                                                    <p className="ant-upload-text">
                                                        please upload OPT RECEIPT file
                                                    </p>
                                                    <p className="ant-upload-hint">
                                                        Support for a single upload.
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

                            {employee?.work_authorization?.title === "Other" && (
                                <Form.Item
                                    label="Specify Visa Title"
                                    name={["work_authorization", "title"]}
                                >
                                    <Input disabled={isDisable} />
                                </Form.Item>
                            )}

                            <Form.Item
                                // name={["work_authorization", "start_date"]}
                                label="Start Date"
                            >
                                <DatePicker
                                    disabled={isDisable}
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
                                    disabled={isDisable}
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
                    {!personalInfo && (
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
                                <Input disabled={isDisable} />
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
                                <Input disabled={isDisable} />
                            </Form.Item>
                            <Form.Item
                                name={["reference", "referee_info", "middle_name"]}
                                label="Middle Name"
                            >
                                <Input disabled={isDisable} />
                            </Form.Item>
                            <Form.Item name={["reference", "referee_info", "phone"]} label="Phone">
                                <Input disabled={isDisable} />
                            </Form.Item>
                            <Form.Item name={["reference", "referee_info", "email"]} label="Email">
                                <Input disabled={isDisable} />
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
                                <Input disabled={isDisable} />
                            </Form.Item>
                        </Form.Item>
                    )}
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
                            <Input disabled={isDisable} />
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
                            <Input disabled={isDisable} />
                        </Form.Item>
                        <Form.Item
                            name={["reference", "emergency_contact", "middle_name"]}
                            label="Middle Name"
                        >
                            <Input disabled={isDisable} />
                        </Form.Item>
                        <Form.Item name={["reference", "emergency_contact", "phone"]} label="Phone">
                            <Input disabled={isDisable} />
                        </Form.Item>
                        <Form.Item name={["reference", "emergency_contact", "email"]} label="Email">
                            <Input disabled={isDisable} />
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
                            <Input disabled={isDisable} />
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
                                    !isDisable && !personalInfo && (
                                        <DeleteOutlined onClick={() => handleFileRemove(file)} />
                                    ),
                                ]}
                            >
                                {file.name}
                            </List.Item>
                        )}
                    />
                    {(onboardingStatus === "Never submitted" || onboardingStatus === "rejected") &&
                        !personalInfo && (
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    save
                                </Button>
                                <Button style={{ marginLeft: 10 }} onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </Form.Item>
                        )}

                    {personalInfo && isDisable && (
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button style={{ marginLeft: 10 }} onClick={handleEdit}>
                                Edit
                            </Button>
                        </Form.Item>
                    )}

                    {personalInfo && !isDisable && (
                        <div>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    save
                                </Button>
                                <Button
                                    style={{ marginLeft: 10 }}
                                    onClick={handleFirstCancelButton}
                                >
                                    cancel
                                </Button>
                            </Form.Item>

                            <Form.Item>
                                {/* The button or element that triggers the Popconfirm */}
                                <Popconfirm
                                    title="Are you sure you want to discard all of
                                the changes?"
                                    open={popConfirmVisible}
                                    onConfirm={handleConfirm}
                                    onCancel={handleCancel}
                                    okText="Yes"
                                    cancelText="No"
                                ></Popconfirm>
                            </Form.Item>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
};

export default EmployeeForm;
