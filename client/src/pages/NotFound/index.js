import React from "react";
import { Result, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div
            style={{
                width: "1323px",
                height: "713px",
                flexShrink: "0",
                borderRadius: "4px",
                backgroundColor: "#FFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Result
                icon={<InfoCircleOutlined style={{ color: "#5048E5" }} />}
                title="Oops, something went wrong!"
                extra={
                    <Link to="/">
                        <Button type="primary" size="large" style={{ backgroundColor: "#5048E5" }}>
                            Go Home
                        </Button>
                    </Link>
                }
            />
        </div>
    );
}
