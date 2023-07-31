import React from "react";
import OnboardingForm from "./onboardingForm";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployeeAction, fetchDocumentsAction } from "app/employeeSlice";
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
                    <OnboardingForm
                        title={"Onboarding application"}
                        onboardingStatus={employee.onboarding_status}
                        isDisabled={false}
                    />
                );
            case "Rejected":
                return (
                    <OnboardingForm
                        title={"Resubmit for Rejected Onboarding application"}
                        onboardingStatus={employee.onboarding_status}
                        isDisabled={false}
                    />
                );
            case "Pending":
                return (
                    <OnboardingForm
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
