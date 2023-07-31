import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getProfileDetail } from "app/hrSlice";

export default function HrProfileDetail() {
    const dispatch = useDispatch();
    const { employeeId } = useParams();
    const { employee } = useSelector((state) => state.employee);
    const { selectedEmployee } = useSelector((state) => state.hr);

    useEffect(() => {
        dispatch(getProfileDetail({ id: employee.id, employeeId }));
    }, []);

    // const fields = [
    //     // name
    //     {
    //         name: "First Name",
    //         type: "text",
    //     },
    //     {
    //         name: "Last Name",
    //         type: "text",
    //     },
    //     {
    //         name: "Middle Name",
    //         type: "text",
    //     },
    //     {
    //         name: "Preferred Name",
    //         type: "text",
    //     },
    //     // current_address
    //     {
    //         name: "Building/Apt",
    //         type: "text",
    //     },
    //     {
    //         name: "Street Name",
    //         type: "text",
    //     },
    //     {
    //         name: "City",
    //         type: "text",
    //     },
    //     {
    //         name: "State",
    //         type: "text",
    //     },
    //     {
    //         name: "Zip code",
    //         type: "text",
    //     },
    //     // profile_picture
    //     {
    //         name: "Profile Picture",
    //         type: "text",
    //     },
    //     // identificaion_info
    //     {
    //         name: "SSN",
    //         type: "text",
    //     },
    //     {
    //         name: "Date of Birth",
    //         type: "text",
    //     },
    //     {
    //         name: "Gender",
    //         type: "text",
    //     },
    //     // work_authorization
    //     {
    //         name: "Title",
    //         type: "text",
    //     },
    //     {
    //         name: "Start Date",
    //         type: "text",
    //     },
    //     {
    //         name: "End Date",
    //         type: "text",
    //     },
    //     // reference
    //     {
    //         name: "First Name",
    //         type: "text",
    //     },
    //     {
    //         name: "Last Name",
    //         type: "text",
    //     },
    //     {
    //         name: "Middle Name",
    //         type: "text",
    //     },
    //     {
    //         name: "Phone",
    //         type: "text",
    //     },
    //     {
    //         name: "Email",
    //         type: "text",
    //     },
    //     {
    //         name: "Relationship",
    //         type: "text",
    //     },
    //     // Emergency_contact
    //     {
    //         name: "First Name",
    //         type: "text",
    //     },
    //     {
    //         name: "Last Name",
    //         type: "text",
    //     },
    //     {
    //         name: "Middle Name",
    //         type: "text",
    //     },
    //     {
    //         name: "Phone",
    //         type: "text",
    //     },
    //     {
    //         name: "Email",
    //         type: "text",
    //     },
    //     {
    //         name: "Relationship",
    //         type: "text",
    //     },
    //     // onboarding_status
    //     {
    //         name: "Onboarding Status",
    //         type: "text",
    //     },
    // ];

    return (
        <>
            <h1>{selectedEmployee.work_authorization?.title}</h1>
        </>
    );
}
