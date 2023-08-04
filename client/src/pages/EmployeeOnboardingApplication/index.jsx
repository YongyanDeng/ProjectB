import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

import { fetchEmployeeAction, fetchDocumentsAction } from "app/employeeSlice";
import EmployeeForm from "components/EmployeeForm";

const OnboardingPage = () => {
    const { employee, documents, status } = useSelector((state) => state.employee);
    const dispatch = useDispatch();
    const [detail, setDetail] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoaded(true);
        dispatch(fetchEmployeeAction(employee.id));
        // dispatch(fetchDocumentsAction(employee.id));
    }, []);

    useEffect(() => {
        if (loaded && status === "successed") {
            setDetail(employee);
        }
    }, [employee]);

    const renderContent = () => {
        return (
            <>
                {detail ? (
                    // Use curly braces to wrap the switch statement content
                    (() => {
                        switch (employee.onboarding_status) {
                            case "Never submitted":
                                // return <div>never submitted</div>;
                                return (
                                    <div className="center-wrapper">
                                        <EmployeeForm
                                            formData={detail}
                                            personalInfo={false}
                                            title={"Onboarding application"}
                                            onboardingStatus={employee.onboarding_status}
                                            enableEdit={true}
                                        />
                                    </div>
                                );

                            case "Rejected":
                                return (
                                    <div className="center-wrapper">
                                        <EmployeeForm
                                            formData={detail}
                                            personalInfo={false}
                                            title={"Resubmit for Rejected Onboarding application"}
                                            onboardingStatus={employee.onboarding_status}
                                            enableEdit={true}
                                        />
                                    </div>
                                );
                            case "Pending":
                                return (
                                    <div className="center-wrapper">
                                        <EmployeeForm
                                            formData={detail}
                                            personalInfo={false}
                                            title={"Please wait for HR to review your application"}
                                            onboardingStatus={employee.onboarding_status}
                                            enableEdit={false}
                                        />
                                    </div>
                                );
                            case "Approved":
                                // Redirect to the home page
                                navigate("/"); // Update this with the actual home page URL
                                return null;
                            default:
                                return null;
                        }
                    })()
                ) : (
                    <Spin size="large" />
                )}
            </>
        );
    };

    return renderContent();
};

export default OnboardingPage;
