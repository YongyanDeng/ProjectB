import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getProfileDetail } from "app/hrSlice";
import OnboardingForm from "pages/EmployeeOnboardingApplication/OnboardingForm";

export default function HrOnboardingDetail() {
    const dispatch = useDispatch();
    const { employeeId } = useParams();
    const { employee } = useSelector((state) => state.employee);
    const { selectedEmployee } = useSelector((state) => state.hr);
    const title = "Onboarding Application Detail";

    useEffect(() => {
        dispatch(getProfileDetail({ id: employee.id, employeeId }));
    }, []);

    const fields = [
        // Name
        {
            name: "First Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "First Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Last Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Last Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Middle Name",
            type: "text",
        },
        {
            name: "Preferred Name",
            type: "text",
        },

        // Picture
        {
            name: "Profile Picture",
            type: "img",
        },

        // current_address
        {
            name: "Street",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Street CANNOT be empty",
                },
            ],
        },
        {
            name: "Building/Apt",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Building/Apt CANNOT be empty",
                },
            ],
        },
        {
            name: "City",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "City CANNOT be empty",
                },
            ],
        },
        {
            name: "State",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "State CANNOT be empty",
                },
            ],
        },
        {
            name: "Zip",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Zip CANNOT be empty",
                },
            ],
        },

        // contact_info
        {
            name: "Cell Phone Number",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Cell Phone Number CANNOT be empty",
                },
            ],
        },
        {
            name: "Work Phone Number",
            type: "text",
        },
        {
            name: "Email",
            type: "text",
        },

        // identificaion_info
        {
            name: "SSN",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "SSN CANNOT be empty",
                },
            ],
        },
        {
            name: "Date of Birth",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Date of Birth CANNOT be empty",
                },
            ],
        },
        {
            name: "Gender",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Gender CANNOT be empty",
                },
            ],
        },

        // work_authorization
        {
            name: "Title",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Title CANNOT be empty",
                },
            ],
        },
        {
            name: "Start Date",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Start Date CANNOT be empty",
                },
            ],
        },
        {
            name: "End Date",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "End Date CANNOT be empty",
                },
            ],
        },
        {
            name: "Days Remaining",
            type: "text",
        },

        // reference
        {
            name: "First Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "First Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Last Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Last Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Middle Name",
            type: "text",
        },
        {
            name: "Phone",
            type: "text",
        },
        {
            name: "Email",
            type: "text",
        },
        {
            name: "Relationship",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Relationship CANNOT be empty",
                },
            ],
        },

        // Emergency_contact
        {
            name: "First Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "First Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Last Name",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Last Name CANNOT be empty",
                },
            ],
        },
        {
            name: "Middle Name",
            type: "text",
        },
        {
            name: "Phone",
            type: "text",
        },
        {
            name: "Email",
            type: "text",
        },
        {
            name: "Relationship",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Relationship CANNOT be empty",
                },
            ],
        },

        // onboarding_status
        {
            name: "Onboarding Status",
            type: "text",
        },
    ];

    return <OnboardingForm title={title} data={selectedEmployee} fields={fields} />;
}
