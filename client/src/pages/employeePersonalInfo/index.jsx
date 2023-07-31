import React from "react";
import EmployeeForm from "components/EmployeeForm";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployeeAction, fetchDocumentsAction } from "app/employeeSlice";
const PersonalInfoPage = () => {
    const { employee, status } = useSelector((state) => state.employee);
    const [detail, setDetail] = useState(null);
    // useEffect(() => {
    //     if (status === "successed" && submitted) {
    //         navigate("/");
    //     } else if (status === "failed" && submitted) {
    //         message.error(`${error}`);
    //     }
    // }, [submitted, status]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchEmployeeAction(employee.id));
        // dispatch(fetchDocumentsAction(employee.id));
    }, []);
    useEffect(() => {
        if (status === "successed" && !!Object.keys(employee).length) {
            console.log("update", employee);
            setDetail(employee);
        }
    }, [employee]);
    return (
        <EmployeeForm
            employee={detail}
            personalInfo={true}
            title={"Personal Information"}
            onboardingStatus={employee.onboarding_status}
            isDisabled={true}
        />
    );
};

export default PersonalInfoPage;
