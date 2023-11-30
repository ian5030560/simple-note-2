import React, { useState } from "react";
import {
    Flex,
    Avatar,
    Typography,
    theme,
    Dropdown
} from "antd";
import { UserOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import {BoxArrowInRight} from "react-bootstrap-icons";
import { ThemeMenu, FileMenu } from "./treeMenu";
const { Title } = Typography;

const UserProfile = ({ username, src, onLogout, onSet }) => {

    const { token } = theme.useToken();

    const items = [
        {
            key: "setting",
            label: "設定",
            icon: <SettingOutlined/>
        },
        {
            key: "log out",
            label: "登出",
            icon: <BoxArrowInRight/>
        }
    ];

    const handleClick = ({key}) => {
        switch(key){
            case "setting":
                onSet?.();
                break;
            case "logout":
                onLogout?.();
                break;
            default:
                break;
        }
    }

    return <Flex
        align="center"
        gap="small"
        style={{padding: token.padding}}
    >
        <Avatar
            size={"large"}
            shape="sqaure"
            icon={src ? null : <UserOutlined />}
            src={src}
        />
        <Title level={4} style={{ color: "white"}}>{username}</Title>
        <Dropdown
            menu={{
                items,
                onClick: handleClick
            }}
            trigger={"click"}
            placement="bottom"
        >
            <EllipsisOutlined style={{ color: "white"}}/>
        </Dropdown>
    </Flex>
}

const SideBar = () => {

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
            <UserProfile username="username"/>
            <FileMenu />
        </Flex>
        <ThemeMenu style={{
            borderRadius: token.Menu.itemBorderRadius
        }} />
    </Flex>
}

export default SideBar;