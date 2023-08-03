import style from "./style.module.css";

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
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
    Spin,
} from "antd";
import dayjs from "dayjs";
import { InboxOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";

import {
    fetchEmployeeAction,
    updateEmployeeAction,
    setOnboardingApplication,
    uploadDocumentAction,
    fetchDocumentsAction,
    deleteDocumentAction,
    setTextInfo,
} from "app/employeeSlice";
import { fetchDocuments } from "services/employee";

const { Option } = Select;

const EmployeeForm = ({
    formData,
    personalInfo,
    title,
    onboardingStatus,
    enableEdit,
    files,
    hrStatus,
}) => {
    const dispatch = useDispatch();

    const [imageUrl, setImageUrl] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const { employee: operator, documents, status } = useSelector((state) => state.employee);
    const { message: errMessage } = useSelector((state) => state.error);
    const [dateValid, setDateValid] = useState(false);
    const [selectedFile, setSelectedFile] = useState({ uid: "" });
    const [uploadedfileList, setUploadedfileList] = useState([]);
    const [isDisable, setIsDisable] = useState(!enableEdit);
    const [saved, setSaved] = useState(false);

    const handleTextInput = (name) => (e) => {
        dispatch(
            setTextInfo({
                name,
                content: e.target.value,
            }),
        );
    };

    const handleOptionInput = (name) => (value) => {
        dispatch(
            setTextInfo({
                name,
                content: value,
            }),
        );
    };

    const handleImageLinkChange = (name) => (e) => {
        setImageUrl(() => e.target.value);
        dispatch(
            setTextInfo({
                name,
                content: e.target.value,
            }),
        );
    };

    const handleUsCitizenChange = (value) => {
        // Update the onboardingApplication with the selected value for usCitizen
        dispatch(
            setOnboardingApplication({
                ...formData,
                usCitizen: value,
            }),
        );
    };

    const handleWorkAuthorization = (value) => {
        // Update the onboardingApplication with the selected value for usCitizen

        dispatch(
            setOnboardingApplication({
                ...formData,
                work_authorization: {
                    ...formData?.work_authorization,
                    title: value,
                },
            }),
        );
    };

    const handleDateChange = (date, name) => {
        // Update the onboardingApplication with the selected value for Date

        if (date) {
            const dateString = date.format("YYYY-MM-DD");
            setSelectedDate({
                work_authorization: {
                    ...selectedDate.work_authorization,
                    [name]: dateString,
                },
            });
            setDateValid(true);
        } else {
            setSelectedDate({
                work_authorization: {
                    ...selectedDate.work_authorization,
                    [name]: null,
                },
            });
        }
    };

    const disabledEndDate = (current) => {
        const startDate = selectedDate.work_authorization.start_date;
        if (!current || !startDate) {
            return false;
        }
        const currentString = dayjs(current).format("YYYY-MM-DD");

        return dayjs(currentString).isBefore(startDate);
    };

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
            dispatch(deleteDocumentAction({ id: formData.id, documentId: file.id }));
        }
        setSelectedFile({ uid: "" });
    };

    const handleSaveForm = async () => {
        try {
            console.log("show employee", formData);
            // data.work_authorization.end_date=data.work_authorization.end_date.toISOString();

            console.log("show selectedDate", selectedDate);
            const finalData = {
                ...formData,
                work_authorization: {
                    title: formData.work_authorization.title,
                    start_date: selectedDate.work_authorization.start_date,
                    end_date: selectedDate.work_authorization.end_date,
                },
            };
            console.log("show final data", finalData);

            await dispatch(updateEmployeeAction({ id: formData?.id, employee: finalData }));
            if (!errMessage && Object.keys(selectedFile).length > 1)
                await dispatch(uploadDocumentAction({ id: formData?.id, document: selectedFile }));
            if (personalInfo) {
                setIsDisable(() => true);
            }

            message.success("employee data saved successfully!");
            setSaved(() => true);

            await dispatch(fetchEmployeeAction(formData.id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        if (saved) {
            await dispatch(
                updateEmployeeAction({
                    id: formData?.id,
                    employee: { onboarding_status: "Pending" },
                }),
            );
            setIsDisable(true);
        } else {
            console.log("show employee", formData);
            // data.work_authorization.end_date=data.work_authorization.end_date.toISOString();

            console.log("show selectedDate", selectedDate);
            const finalData = {
                ...formData,
                work_authorization: {
                    title: formData.work_authorization.title,
                    start_date: selectedDate.work_authorization.start_date,
                    end_date: selectedDate.work_authorization.end_date,
                },
                onboarding_status: "Pending",
            };
            console.log("show final data", finalData);

            await dispatch(updateEmployeeAction({ id: formData?.id, employee: finalData }));
            if (!errMessage && Object.keys(selectedFile).length > 1)
                await dispatch(uploadDocumentAction({ id: formData?.id, document: selectedFile }));

            setIsDisable(true);

            message.success("employee data saved successfully!");
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
        // setSaved(false);
    };

    const pdfUrlTransfer = (document) => {
        const blob = new Blob([new Uint8Array(document.content.data)], { type: "application/pdf" });
        // Open the PDF in a new window or tab
        const pdfUrl = URL.createObjectURL(blob);

        const urlFile = {
            id: document._id,
            uid: document.uid,
            name: document.document_name,
            document_type: document.document_type,
            contentType: document.contentType,
            file_url: pdfUrl, // Use the uploaded file URL here
            thumbUrl: pdfUrl,
            fromDocuments: "yes",
        };
        return urlFile;
    };

    useEffect(() => {
        // if (operator.role === "Employee") {
        //     dispatch(fetchDocumentsAction(formData.id));
        // }
        setSelectedDate(() => {
            return {
                work_authorization: {
                    start_date: formData.work_authorization?.start_date,
                    end_date: formData.work_authorization?.end_date,
                },
            };
        });
    }, [formData]);

    useEffect(() => {
        if (documents.length >= 1) {
            setUploadedfileList(() =>
                documents.map((document) => {
                    return pdfUrlTransfer(document);
                }),
            );
        }
    }, [documents]);

    return (
        <>
            {(hrStatus && hrStatus === "successed") || status === "successed" ? (
                <div className="center-wrapper">
                    <div className={style.FormBox}>
                        <div className={style.topContent}>
                            <Typography.Title level={2} className={style.title}>
                                {title}
                            </Typography.Title>
                        </div>

                        <Form
                            className={style.formContent}
                            initialValues={formData}
                            onFinish={handleSaveForm}
                            labelAlign="left"
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                        >
                            <Form.Item
                                className={style.formItem}
                                label="First Name"
                                name={["name", "first_name"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your first name",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["name", "first_name"])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Last Name"
                                name={["name", "last_name"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your last name",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["name", "last_name"])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Middle Name"
                                name={["name", "middle_name"]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["name", "middle_name"])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Preferred Name"
                                name={["name", "preferred_name"]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["name", "preferred_name"])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Profile Picture"
                                name="profile_picture"
                            >
                                <Input
                                    id="image-link-input"
                                    placeholder="Profile Picture"
                                    onChange={handleImageLinkChange(["profile_picture"])}
                                    disabled={isDisable}
                                />
                            </Form.Item>

                            <Form.Item
                                className={style.formItem}
                                wrapperCol={{ offset: 9, span: 15 }}
                            >
                                <img
                                    src={imageUrl ? imageUrl : formData?.profile_picture}
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        objectFit: "cover",
                                    }}
                                    alt=""
                                />
                            </Form.Item>
                            <Form.Item label="Address" className={style.formItem}></Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Street Name"
                                name={["address", "street_name"]} // Use an array for nested fields
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your street name",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["address", "street_name"])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Building / Apt"
                                name={["address", "building_apt"]} // Use an array for nested fields
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your building or apt number",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["address", "building_apt"])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="City"
                                name={["address", "city"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the city",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["address", "city"])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="State"
                                name={["address", "state"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the state",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["address", "state"])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="ZIP"
                                name={["address", "zip"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the ZIP",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["address", "zip"])}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Contact Information"
                                className={style.formItem}
                            ></Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Cell Phone Number"
                                name={["contact_info", "cell_phone"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your cell phone number",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["contact_info", "cell_phone"])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Work Phone Number"
                                name={["contact_info", "work_phone"]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["contact_info", "work_phone"])}
                                />
                            </Form.Item>
                            <Form.Item className={style.formItem} label="Email">
                                <Input disabled value={formData?.email} />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="SSN"
                                name={["identification_info", "SSN"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your SSN",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput(["identification_info", "SSN"])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Date of Birth"
                                name={["identification_info", "date_of_birth"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your date of birth",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput([
                                        "identification_info",
                                        "date_of_birth",
                                    ])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Gender"
                                name={["identification_info", "gender"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your gender",
                                    },
                                ]}
                            >
                                <Select
                                    disabled={isDisable}
                                    onChange={handleOptionInput(["identification_info", "gender"])}
                                >
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                    <Option value="other">I do not wish to answer</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Work Authorization"
                                className={style.formItem}
                            ></Form.Item>
                            <Form.Item
                                className={style.formItem}
                                label="Permanent resident or citizen of the U.S.?"
                                name="usCitizen"
                            >
                                <Select
                                    onChange={handleOptionInput(["usCitizen"])}
                                    disabled={isDisable}
                                >
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                </Select>
                            </Form.Item>
                            {formData.usCitizen === "yes" && (
                                <Form.Item
                                    className={style.formItem}
                                    label="What is your work authorization?"
                                    name={["work_authorization", "title"]}
                                >
                                    <Select
                                        value={formData?.work_authorization.title}
                                        onChange={handleOptionInput([
                                            "work_authorization",
                                            "title",
                                        ])}
                                        disabled={isDisable}
                                    >
                                        <Option value="Green Card">Green Card</Option>
                                        <Option value="Citizen">Citizen</Option>
                                    </Select>
                                </Form.Item>
                            )}
                            {formData.usCitizen === "no" && (
                                <>
                                    <Form.Item
                                        className={style.formItem}
                                        label="What is your work authorization?"
                                        name={["work_authorization", "title"]}
                                    >
                                        <Select
                                            onChange={handleOptionInput([
                                                "work_authorization",
                                                "title",
                                            ])}
                                            disabled={isDisable}
                                        >
                                            <Option value="H1-B">H1-B</Option>
                                            <Option value="L2">L2</Option>
                                            <Option value="F1(CPT/OPT)">F1(CPT/OPT)</Option>
                                            <Option value="H4">H4</Option>
                                            <Option value="Other">Other</Option>
                                        </Select>
                                    </Form.Item>

                                    {formData?.work_authorization?.title === "F1(CPT/OPT)" &&
                                        !personalInfo && (
                                            <>
                                                {operator?.role === "Employee" && (
                                                    <Form.Item
                                                        className={style.formItem}
                                                        label="Upload OPT RECEIPT File"
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
                                                    >
                                                        <Upload.Dragger
                                                            name="pdfFile"
                                                            accept=".pdf"
                                                            multiple={false}
                                                            disabled={isDisable}
                                                            beforeUpload={beforeUpload}
                                                            customRequest={handleFileUpload}
                                                            itemRender={(
                                                                originNode,
                                                                file,
                                                                currFileList,
                                                            ) => {
                                                                return null;
                                                            }}
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
                                                    </Form.Item>
                                                )}
                                                <Form.Item className={style.formItem} label="Files">
                                                    <List
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please upload a PDF file",
                                                            },
                                                        ]}
                                                        header={
                                                            <div>Summary of Uploaded Files</div>
                                                        }
                                                        bordered
                                                        dataSource={
                                                            operator.role === "Employee"
                                                                ? uploadedfileList
                                                                : files
                                                        }
                                                        renderItem={(file) => (
                                                            <List.Item
                                                                actions={[
                                                                    <a
                                                                        href={file.file_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        Preview
                                                                    </a>,
                                                                    <a
                                                                        href={file.file_url}
                                                                        download={file.name}
                                                                    >
                                                                        Download
                                                                    </a>,
                                                                    !isDisable &&
                                                                        !personalInfo &&
                                                                        formData?.role ===
                                                                            "Employee" && (
                                                                            <DeleteOutlined
                                                                                onClick={() =>
                                                                                    handleFileRemove(
                                                                                        file,
                                                                                    )
                                                                                }
                                                                            />
                                                                        ),
                                                                ]}
                                                            >
                                                                {file.name}
                                                            </List.Item>
                                                        )}
                                                    />
                                                </Form.Item>
                                            </>
                                        )}
                                    {!["", "H1-B", "L2", "F1(CPT/OPT)", "H4"].includes(
                                        formData?.work_authorization?.title,
                                    ) && (
                                        <Form.Item
                                            className={style.formItem}
                                            label="Specify Visa Title"
                                            name={["work_authorization", "title"]}
                                        >
                                            <Input
                                                disabled={isDisable}
                                                onChange={handleTextInput([
                                                    "work_authorization",
                                                    "title",
                                                ])}
                                            />
                                        </Form.Item>
                                    )}

                                    <Form.Item
                                        className={style.formItem}
                                        label="Start Date"
                                        rules={[
                                            {
                                                required: { dateValid },
                                                message: "Please enter the start state",
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            disabled={isDisable}
                                            value={
                                                selectedDate?.work_authorization.start_date
                                                    ? dayjs(
                                                          selectedDate.work_authorization
                                                              .start_date,
                                                      )
                                                    : null
                                            }
                                            onChange={(date) =>
                                                handleDateChange(date, "start_date")
                                            }
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        className={style.formItem}
                                        label="End Date"
                                        rules={[
                                            {
                                                required: { dateValid },
                                                message: "Please enter the end state",
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            disabled={isDisable}
                                            value={
                                                selectedDate?.work_authorization.end_date
                                                    ? dayjs(
                                                          selectedDate.work_authorization.end_date,
                                                      )
                                                    : null
                                            }
                                            onChange={(date) => handleDateChange(date, "end_date")}
                                            disabledDate={disabledEndDate}
                                        />
                                    </Form.Item>
                                </>
                            )}
                            {!personalInfo && (
                                <>
                                    <Form.Item
                                        className={style.formItem}
                                        label="Reference"
                                    ></Form.Item>
                                    <Form.Item
                                        className={style.formItem}
                                        name={["reference", "referee_info", "first_name"]}
                                        label="First Name"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter your reference first name",
                                            },
                                        ]}
                                    >
                                        <Input
                                            disabled={isDisable}
                                            onChange={handleTextInput([
                                                "reference",
                                                "referee_info",
                                                "first_name",
                                            ])}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className={style.formItem}
                                        name={["reference", "referee_info", "last_name"]}
                                        label="Last Name"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter your reference last name",
                                            },
                                        ]}
                                    >
                                        <Input
                                            disabled={isDisable}
                                            onChange={handleTextInput([
                                                "reference",
                                                "referee_info",
                                                "last_name",
                                            ])}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className={style.formItem}
                                        name={["reference", "referee_info", "middle_name"]}
                                        label="Middle Name"
                                    >
                                        <Input
                                            disabled={isDisable}
                                            onChange={handleTextInput([
                                                "reference",
                                                "referee_info",
                                                "middle_name",
                                            ])}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className={style.formItem}
                                        name={["reference", "referee_info", "phone"]}
                                        label="Phone"
                                    >
                                        <Input
                                            disabled={isDisable}
                                            onChange={handleTextInput([
                                                "reference",
                                                "referee_info",
                                                "phone",
                                            ])}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className={style.formItem}
                                        name={["reference", "referee_info", "email"]}
                                        label="Email"
                                    >
                                        <Input
                                            disabled={isDisable}
                                            onChange={handleTextInput([
                                                "reference",
                                                "referee_info",
                                                "email",
                                            ])}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className={style.formItem}
                                        name={["reference", "referee_info", "relationship"]}
                                        label="Relationship"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter your reference relationship",
                                            },
                                        ]}
                                    >
                                        <Input
                                            disabled={isDisable}
                                            onChange={handleTextInput([
                                                "reference",
                                                "referee_info",
                                                "relationship",
                                            ])}
                                        />
                                    </Form.Item>
                                </>
                            )}
                            {/* Emergency Contacts */}
                            <Form.Item
                                className={style.formItem}
                                label="Emergency Contact"
                            ></Form.Item>
                            <Form.Item
                                className={style.formItem}
                                name={["reference", "emergency_contact", "first_name"]}
                                label="First Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your reference first name",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput([
                                        "reference",
                                        "emergency_contact",
                                        "first_name",
                                    ])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                name={["reference", "emergency_contact", "last_name"]}
                                label="Last Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your reference last name",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput([
                                        "reference",
                                        "emergency_contact",
                                        "last_name",
                                    ])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                name={["reference", "emergency_contact", "middle_name"]}
                                label="Middle Name"
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput([
                                        "reference",
                                        "emergency_contact",
                                        "middle_name",
                                    ])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                name={["reference", "emergency_contact", "phone"]}
                                label="Phone"
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput([
                                        "reference",
                                        "emergency_contact",
                                        "phone",
                                    ])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                name={["reference", "emergency_contact", "email"]}
                                label="Email"
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput([
                                        "reference",
                                        "emergency_contact",
                                        "email",
                                    ])}
                                />
                            </Form.Item>
                            <Form.Item
                                className={style.formItem}
                                name={["reference", "emergency_contact", "relationship"]}
                                label="Relationship"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your emergency contact relationship",
                                    },
                                ]}
                            >
                                <Input
                                    disabled={isDisable}
                                    onChange={handleTextInput([
                                        "reference",
                                        "emergency_contact",
                                        "relationship",
                                    ])}
                                />
                            </Form.Item>

                            {/* Add summary of uploaded files or documents */}
                            {/* ... */}
                            {(onboardingStatus === "Never submitted" ||
                                onboardingStatus === "Rejected") &&
                                operator.role === "Employee" &&
                                !personalInfo && (
                                    <Form.Item
                                        className={style.formItem}
                                        wrapperCol={{ offset: 8, span: 16 }}
                                    >
                                        <Button type="primary" htmlType="submit">
                                            Save
                                        </Button>

                                        <Button style={{ marginLeft: 10 }} onClick={handleSubmit}>
                                            Submit
                                        </Button>
                                    </Form.Item>
                                )}

                            {personalInfo && isDisable && (
                                <Form.Item
                                    className={style.formItem}
                                    wrapperCol={{ offset: 8, span: 16 }}
                                >
                                    <Button style={{ marginLeft: 10 }} onClick={handleEdit}>
                                        Edit
                                    </Button>
                                </Form.Item>
                            )}

                            {personalInfo && !isDisable && (
                                <div>
                                    <Form.Item
                                        className={style.formItem}
                                        wrapperCol={{ offset: 8, span: 16 }}
                                    >
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

                                    <Form.Item className={style.formItem}>
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
            ) : (
                <Spin size="large" />
            )}
        </>
    );
};

export default EmployeeForm;
