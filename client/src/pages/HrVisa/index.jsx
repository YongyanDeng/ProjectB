import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getVisaList } from "app/hrSlice";
import EmployeeTable from "components/EmployeeTable";

export default function Visa() {
    const dispatch = useDispatch();
    const { employee } = useSelector((state) => state.employee);
    const { employees, inProgress } = useSelector((state) => state.hr);
    const [list, setList] = useState(null);
    const [inProgressList, setInProgressList] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const title = "Visa Profiles";

    useEffect(() => {
        // Get profiles list
        dispatch(getVisaList({ id: employee.id }));
    }, []);

    // Update local state: inProgressList
    useEffect(() => {
        setInProgressList(
            inProgress.map((employee) => {
                const output = {
                    key: `inProgress-${employee.id}`,
                    id: employee.id,
                    email: employee.email,
                    name: `${employee.name.first_name} ${employee.name.last_name}`,
                    work_authorization_title: employee.work_authorization
                        ? employee.work_authorization.title
                        : null,
                };
                return output;
            }),
        );
    }, [inProgress]);

    // Update local state: list
    useEffect(() => {
        setList(
            employees.map((employee) => {
                const output = {
                    key: employee.id,
                    id: employee.id,
                    email: employee.email,
                    name: `${employee.name.first_name} ${employee.name.last_name}`,
                    work_authorization_title: employee.work_authorization
                        ? employee.work_authorization.title
                        : null,
                };
                return output;
            }),
        );
    }, [employees]);

    // Update filted list
    useEffect(() => {
        const filtedList = [];
        for (const employee of employees) {
            const output = {
                key: employee.id,
                id: employee.id,
                email: employee.email,
                name: `${employee.name.first_name} ${employee.name.last_name}`,
                work_authorization_title: employee.work_authorization.title,
            };
            if (output.name.toLowerCase().includes(searchInput.toLowerCase())) {
                filtedList.push(output);
            }
        }

        const filtedInProgressList = [];
        for (const employee of inProgress) {
            const output = {
                key: employee.id,
                id: employee.id,
                email: employee.email,
                name: `${employee.name.first_name} ${employee.name.last_name}`,
                work_authorization_title: employee.work_authorization.title,
            };
            if (output.name.toLowerCase().includes(searchInput.toLowerCase())) {
                filtedInProgressList.push(output);
            }
        }
        setList(() => filtedList);
        setInProgressList(() => filtedInProgressList);
    }, [searchInput]);

    // Table columns model
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, employee) => <Link to={`/hr/visaDetail/${employee.id}`}>{text}</Link>,
        },
        {
            title: "Work Authorization Title",
            dataIndex: "work_authorization_title",
            key: "work_authorization_title",
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
        <>
            {list && inProgressList ? (
                <EmployeeTable
                    title={title}
                    placeholder="Search by name.."
                    searchInput={searchInput}
                    lists={[
                        { name: "All", list },
                        { name: "In Progress", list: inProgressList },
                    ]}
                    columns={columns}
                    handleSearchChange={handleSearchChange}
                />
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    );
}
