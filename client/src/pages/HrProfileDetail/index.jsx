import "./styles.css";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { FilePdfOutlined, MailOutlined } from "@ant-design/icons";

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
            setDetail(selectedEmployee);
        }
    }, [selectedEmployee]);

    return (
        <div className="center-wrapper">
            {detail ? (
                <EmployeeForm
                    employee={detail}
                    personalInfo={true}
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
