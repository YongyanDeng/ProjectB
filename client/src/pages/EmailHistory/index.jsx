import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getEmailHistory } from "app/hrSlice";
import EmployeeTable from "components/EmployeeTable";

export default function EmailHistory() {
    const dispatch = useDispatch();
    const { employee } = useSelector((state) => state.employee);
    const { emailHistory } = useSelector((state) => state.hr);
    const [list, setList] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const title = "Email History";

    useEffect(() => {
        dispatch(getEmailHistory({ id: employee.id }));
    }, []);

    useEffect(() => {
        setList(
            emailHistory.map((record, index) => {
                return {
                    key: index + 1,
                    email: record.email,
                    start_date: new Date(record.createdAt).toLocaleString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    }),
                    status: record.status,
                };
            }),
        );
    }, [emailHistory]);

    useEffect(() => {
        const filteredList = [];
        emailHistory.forEach((record, index) => {
            const output = {
                key: index + 1,
                email: record.email,
                start_date: new Date(record.createdAt).toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                }),
                status: record.status,
            };
            if (output.email.toLowerCase().includes(searchInput.toLowerCase())) {
                filteredList.push(output);
            }
        });
        setList(filteredList);
    }, [searchInput]);

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Sent At",
            dataIndex: "start_date",
            key: "start_date",
        },
    ];

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    return (
        <EmployeeTable
            title={title}
            searchInput={searchInput}
            placeholder="Search by email.."
            lists={[{ name: "Email History", list }]}
            columns={columns}
            handleSearchChange={handleSearchChange}
        />
    );
}
