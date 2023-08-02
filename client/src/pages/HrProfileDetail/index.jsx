import "./styles.css";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

import { getProfileDetail } from "app/hrSlice";
import EmployeeForm from "components/EmployeeForm";

const visaProcess = ["OPT Receipt", "OPT EAD", "I-983", "I-20"];

export default function HrProfileDetail() {
    const dispatch = useDispatch();
    const { employeeId } = useParams();
    const { employee } = useSelector((state) => state.employee);
    const { selectedEmployee, status } = useSelector((state) => state.hr);
    const [detail, setDetail] = useState(null);

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

    return (
        <div className="center-wrapper">
            {detail ? (
                <EmployeeForm
                    employee={detail}
                    personalInfo={false}
                    title={"Personal Information"}
                    onboardingStatus={detail.onboarding_status}
                    isDisabled={true}
                    files={detail.documents}
                    hrStatus={status}
                />
            ) : (
                <Spin size="large" />
            )}
        </div>
    );
}
