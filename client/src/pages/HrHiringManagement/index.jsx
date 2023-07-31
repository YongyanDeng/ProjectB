import "./styles.css";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getAllOBApplication } from "app/hrSlice";
import EmailSender from "components/EmailSender";
import EmployeeTable from "components/EmployeeTable";

export default function HiringManagement() {
    const dispatch = useDispatch();
    const { employee } = useSelector((state) => state.employee);
    const { obApplications } = useSelector((state) => state.hr);
    const [list, setList] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const title = "Hiring Management";

    useEffect(() => {
        // Get profiles list
        dispatch(getAllOBApplication({ id: employee.id }));
    }, []);

    useEffect(() => {
        setList(
            obApplications.map((application, index) => {
                return {
                    key: index + 1,
                    id: application.id,
                    email: application.email,
                    name: `${application.name.first_name} ${application.name.last_name}`,
                };
            }),
        );
    }, [obApplications]);

    useEffect(() => {
        const filteredList = [];
        obApplications.forEach((application, index) => {
            const output = {
                key: index + 1,
                id: application.id,
                email: application.email,
                name: `${application.name.first_name} ${application.name.last_name}`,
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
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Onboarding Status",
            key: "View Application",
            render: (application) => (
                <Link to={`/hr/hiringManagement/${application.id}`}>View Application</Link>
            ),
        },
    ];

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    return (
        <div className="hmContainer">
            <div className="email-section">
                <EmailSender />
                <Link to="/hr/emailHistory">Email History</Link>
            </div>

            <EmployeeTable
                title={title}
                searchInput={searchInput}
                placeholder="Search by name.."
                lists={[{ name: "Onboarding Applications", list }]}
                columns={columns}
                handleSearchChange={handleSearchChange}
            />
        </div>
    );
}
