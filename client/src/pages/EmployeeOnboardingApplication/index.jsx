import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchEmployeeAction, fetchDocumentsAction } from "app/employeeSlice";
import EmployeeForm from "components/EmployeeForm";

const OnboardingPage = () => {
    const { employee, status } = useSelector((state) => state.employee);
    // useEffect(() => {
    //     if (status === "successed" && submitted) {
    //         navigate("/");
    //     } else if (status === "failed" && submitted) {
    //         message.error(`${error}`);
    //     }
    // }, [submitted, status]);
    const dispatch = useDispatch();
    const renderContent = () => {
        switch (employee.onboarding_status) {
            case "Never submitted":
                // return <div>never submitted</div>;
                return (
                    <EmployeeForm
                        employee={employee}
                        personalInfo={false}
                        title={"Onboarding application"}
                        onboardingStatus={employee.onboarding_status}
                        isDisabled={false}
                    />
                );

            case "Rejected":
                return (
                    <EmployeeForm
                        employee={employee}
                        personalInfo={false}
                        title={"Resubmit for Rejected Onboarding application"}
                        onboardingStatus={employee.onboarding_status}
                        isDisabled={false}
                    />
                );
            case "Pending":
                return (
                    <EmployeeForm
                        employee={employee}
                        personalInfo={false}
                        title={"Please wait for HR to review your application"}
                        onboardingStatus={employee.onboarding_status}
                        isDisabled={true}
                    />
                );
            case "Approved":
                // Redirect to the home page
                window.location.href = "/home"; // Update this with the actual home page URL
                return null;
            default:
                return null;
        }
    };
    useEffect(() => {
        dispatch(fetchEmployeeAction(employee.id));
        dispatch(fetchDocumentsAction(employee.id));
    }, []);

    return <div>{renderContent()}</div>;
};

export default OnboardingPage;
