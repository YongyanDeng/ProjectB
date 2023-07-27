import React from "react";
import OnboardingForm from "./OnboardingForm";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployeeAction } from "app/employeeSlice";
const OnboardingPage = () => {
    const { employee } = useSelector((state) => state.employee);
    const dispatch = useDispatch();
    const renderContent = () => {
        switch (employee.onboarding_status) {
            case "Never submitted":
                // return <div>never submitted</div>;
                return <OnboardingForm />;
            case "rejected":
                return <div>View feedback and resubmit form</div>;
            case "pending":
                return <div>Please wait for HR to review your application</div>;
            case "approved":
                // Redirect to the home page
                window.location.href = "/home"; // Update this with the actual home page URL
                return null;
            default:
                return null;
        }
    };
    useEffect(() => {
        dispatch(fetchEmployeeAction(employee.id));
    }, []);
    return <div>{renderContent()}</div>;
};

export default OnboardingPage;
