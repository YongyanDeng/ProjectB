import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchEmployeeAction, fetchDocumentsAction } from "app/employeeSlice";
import EmployeeForm from "components/EmployeeForm";

const PersonalInfoPage = () => {
    const dispatch = useDispatch();
    const { employee, status } = useSelector((state) => state.employee);
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        dispatch(fetchEmployeeAction(employee.id));
        // dispatch(fetchDocumentsAction(employee.id));
    }, []);

    useEffect(() => {
        if (status === "successed" && !!Object.keys(employee).length) {
            setDetail(employee);
        }
    }, [employee]);

    return (
        <>
            {detail ? (
                <EmployeeForm
                    employee={detail}
                    personalInfo={true}
                    title={"Personal Information"}
                    onboardingStatus={detail.onboarding_status}
                    enableEdit={false}
                />
            ) : (
                <h1>Loading..</h1>
            )}
        </>
    );
};

export default PersonalInfoPage;
