import React, { useState } from "react";
import {
    Flex,
    Avatar,
    Typography,
    theme,
    Dropdown,
} from "antd";
import { UserOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { BoxArrowInRight } from "react-bootstrap-icons";
import { ThemeMenu, FileMenu } from "./menu";

const { Title } = Typography;

const UserProfile = ({ username, src, onLogout, onSet }) => {

    const { token } = theme.useToken();

    const items = [
        {
            key: "setting",
            label: "設定",
            icon: <SettingOutlined />
        },
        {
            key: "log out",
            label: "登出",
            icon: <BoxArrowInRight />
        }
    ];

    const handleClick = ({ key }) => {
        switch (key) {
            case "setting":
                onSet?.();
                break;
            case "log out":
                onLogout?.();
                break;
            default:
                break;
        }
    }

    return <Flex
        align="baseline"
        gap="small"
        style={{ padding: token.padding }}
    >
        <Avatar
            size={"large"}
            shape="sqaure"
            icon={src ? null : <UserOutlined />}
            src={src}
        />
        <Title level={4} style={{ color: "white" }}>{username}</Title>
        <Dropdown
            menu={{
                items,
                onClick: handleClick
            }}
            trigger={"click"}
            placement="bottom"
        >
            <EllipsisOutlined style={{ color: "white" }} />
        </Dropdown>
    </Flex>
}

const SideBar = ({onLogout}) => {

    const { token } = theme.useToken();

    return <Flex
        vertical
        justify="space-between"
        style={{
            height: "100%",
            backgroundColor: token.colorPrimary,
            borderRight: `${token.lineWidth}px solid ${token.colorBorder}`,
            overflow: "auto",
        }}>
        <Flex vertical>
            <UserProfile username="username" onLogout={onLogout}/>
            <FileMenu />
        </Flex>
        <ThemeMenu style={{
            borderRadius: token.Menu ? token.Menu.itemBorderRadius: 8,
        }} />
    </Flex>
}

export default SideBar;