import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getApplicationList } from "app/hrSlice";
import EmployeeTable from "components/EmployeeTable";

export default function Profiles() {
    const dispatch = useDispatch();
    const { employee } = useSelector((state) => state.employee);
    const { employees } = useSelector((state) => state.hr);
    const [list, setList] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const title = "Employee Profiles";

    useEffect(() => {
        // Get profiles list
        dispatch(getApplicationList({ id: employee.id }));
    }, []);

    useEffect(() => {
        let key = 1;
        setList(
            employees.map((employee) => {
                const output = {
                    key,
                    id: employee.id,
                    email: employee.email,
                    name: `${employee.name.first_name} ${employee.name.last_name}`,
                    phone: employee.contact_info.cell_phone,
                    ssn: employee.identification_info.SSN,
                    work_authorization_title: employee.work_authorization.title,
                };
                key++;
                return output;
            }),
        );
    }, [employees]);

    useEffect(() => {
        let key = 1;
        const filteredList = [];
        for (const employee of employees) {
            const output = {
                key,
                id: employee.id,
                email: employee.email,
                name: `${employee.name.first_name} ${employee.name.last_name}`,
                phone: employee.contact_info.cell_phone,
                ssn: employee.identification_info.SSN,
                work_authorization_title: employee.work_authorization.title,
            };
            if (output.name.toLowerCase().includes(searchInput.toLowerCase())) {
                key++;
                filteredList.push(output);
            }
        }
        setList(filteredList);
    }, [searchInput]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, employee) => <Link to={`/profileDetail/${employee.id}`}>{text}</Link>,
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
            lists={[{ name: "Profile", list }]}
            columns={columns}
            handleSearchChange={handleSearchChange}
        />
    );
}
