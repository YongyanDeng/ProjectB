import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchEmployeeAction, fetchDocumentsAction } from "app/employeeSlice";
import EmployeeForm from "components/EmployeeForm";
import { Spin } from "antd";

const PersonalInfoPage = () => {
    const dispatch = useDispatch();
    const { employee, status } = useSelector((state) => state.employee);
    const [detail, setDetail] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
        dispatch(fetchEmployeeAction(employee.id));
    }, []);

    useEffect(() => {
        if (loaded && status === "successed") {
            setDetail(employee);
        }
    }, [employee]);

    return (
        <>
            {detail ? (
                <div className="center-wrapper">
                    <EmployeeForm
                        formData={detail}
                        personalInfo={true}
                        title={"Personal Information"}
                        onboardingStatus={detail.onboarding_status}
                        enableEdit={false}
                    />
                </div>
            ) : (
                <Spin size="large" />
            )}
        </>
    );
};

export default PersonalInfoPage;
