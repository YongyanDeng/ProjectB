import "./styles.css";

import { Typography, Input, Table, Tabs } from "antd";

export default function EmployeeTable({
    title,
    searchInput,
    placeholder,
    lists,
    columns,
    handleSearchChange,
}) {
    return (
        <div className="container">
            <Typography.Title level={2}>{title}</Typography.Title>
            <Input.Search
                className="searchBox"
                allowClear
                placeholder={placeholder}
                value={searchInput}
                onChange={handleSearchChange}
            />
            <Tabs
                defaultActiveKey="1"
                items={lists.map((list) => {
                    return {
                        key: list.name,
                        label: list.name,
                        children: <Table dataSource={list.list} columns={columns} />,
                    };
                })}
            />
        </div>
    );
}
