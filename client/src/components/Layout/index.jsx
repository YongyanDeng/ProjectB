import React, { useMemo } from "react";
import { Layout, Menu } from "antd";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "hooks/useMediaQuery";

import Navbar from "components/Navbar";
import Footbar from "components/Footbar";

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
    const isMobile = useMediaQuery("(max-width: 392px)");

    const headerStyle = useMemo(
        () => ({
            display: "flex",
            justifyContent: "space-between",
            alignItems: !isMobile ? null : "center",
            width: !isMobile ? "100%" : "392px",
            height: !isMobile ? "48px" : "auto",
            backgroundColor: "#111827",
            padding: "8px 64px",
            flexDirection: !isMobile ? "row" : "column",
        }),
        [isMobile],
    );

    const footerStyle = useMemo(
        () => ({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: !isMobile ? "100%" : "392px",
            height: !isMobile ? "85px" : "auto",
            color: "#FFFFFF",
            backgroundColor: "#111827",
            flexDirection: !isMobile ? "row" : "column",
        }),
        [isMobile],
    );

    const contentStyle = useMemo(
        () => ({
            display: "flex",
            width: !isMobile ? "100%" : "392px",
            minHeight: !isMobile ? "calc(100vh - 48px - 85px)" : "auto",
            padding: !isMobile ? "20px 0px" : "0px 6px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F9FAFB",
            overflow: "auto",
        }),
        [isMobile],
    );

    return (
        <Layout>
            <Header style={headerStyle}>
                <Navbar />
            </Header>
            <Content style={contentStyle}>
                <Outlet />
            </Content>
            <Footer style={footerStyle}>
                <Footbar />
            </Footer>
        </Layout>
    );
}
