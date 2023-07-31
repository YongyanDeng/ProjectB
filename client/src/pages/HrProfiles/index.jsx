import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getProfileList } from "app/hrSlice";
import EmployeeTable from "components/EmployeeTable";

export default function HrProfiles() {
    const dispatch = useDispatch();
    const { employee } = useSelector((state) => state.employee);
    const { employees } = useSelector((state) => state.hr);
    const [list, setList] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const title = "Employee Profiles";

    useEffect(() => {
        // Get profiles list
        dispatch(getProfileList({ id: employee.id }));
    }, []);

    useEffect(() => {
        setList(
            employees.map((employee, index) => {
                return {
                    key: index + 1,
                    id: employee.id,
                    email: employee.email,
                    name: `${employee.name.first_name} ${employee.name.last_name}`,
                    phone: employee.contact_info ? employee.contact_info.cell_phone : null,
                    ssn: employee.identification_info ? employee.identification_info.SSN : null,
                    work_authorization_title: employee.work_authorization
                        ? employee.work_authorization.title
                        : null,
                };
            }),
        );
    }, [employees]);

    useEffect(() => {
        const filteredList = [];
        employees.forEach((employee, index) => {
            const output = {
                key: index + 1,
                id: employee.id,
                email: employee.email,
                name: `${employee.name.first_name} ${employee.name.last_name}`,
                phone: employee.contact_info ? employee.contact_info.cell_phone : null,
                ssn: employee.identification_info ? employee.identification_info.SSN : null,
                work_authorization_title: employee.work_authorization
                    ? employee.work_authorization.title
                    : null,
            };
            if (output.name.toLowerCase().includes(searchInput.toLowerCase())) {
                filteredList.push(output);
            }
        });
        setList(filteredList);
    }, [searchInput]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, employee) => <Link to={`/hr/profiles/${employee.id}`}>{text}</Link>,
        },
        {
            title: "SSN",
            dataIndex: "ssn",
            key: "ssn",
        },
        {
            title: "Work Authorization Title",
            dataIndex: "work_authorization_title",
            key: "work_authorization_title",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
    ];

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    return (
        <EmployeeTable
            title={title}
            searchInput={searchInput}
            placeholder="Search by name.."
            lists={[{ name: "Profile", list }]}
            columns={columns}
            handleSearchChange={handleSearchChange}
        />
    );
}
