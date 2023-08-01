import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEmployeeAction, fetchDocumentsAction } from "app/employeeSlice";
import EmployeeForm from "components/EmployeeForm";

const OnboardingPage = () => {
    const { employee, status } = useSelector((state) => state.employee);
    const dispatch = useDispatch();
    const [detail, setDetail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchEmployeeAction(employee.id));
        // dispatch(fetchDocumentsAction(employee.id));
    }, []);

    useEffect(() => {
        if (status === "successed" && !!Object.keys(employee).length) {
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
                                    <EmployeeForm
                                        employee={detail}
                                        personalInfo={false}
                                        title={"Onboarding application"}
                                        onboardingStatus={employee.onboarding_status}
                                        enableEdit={true}
                                    />
                                );

                            case "Rejected":
                                return (
                                    <EmployeeForm
                                        employee={detail}
                                        personalInfo={false}
                                        title={"Resubmit for Rejected Onboarding application"}
                                        onboardingStatus={employee.onboarding_status}
                                        enableEdit={true}
                                    />
                                );
                            case "Pending":
                                return (
                                    <EmployeeForm
                                        employee={detail}
                                        personalInfo={false}
                                        title={"Please wait for HR to review your application"}
                                        onboardingStatus={employee.onboarding_status}
                                        enableEdit={false}
                                    />
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
                    <h1>Loading..</h1>
                )}
            </>
        );
    };

    return <div className="center-wrapper">{renderContent()}</div>;
};

export default OnboardingPage;
