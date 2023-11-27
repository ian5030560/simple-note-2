import React from "react";
import { 
    Flex, 
    Avatar, 
    Typography, 
    theme,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import {ThemeMenu, FileMenu} from "./menu";
const { Text, Title } = Typography;

const UserProfile = ({ username, src }) => {
    
    const {token} = theme.useToken();

    return <Flex
        align="center"
        gap="large"
        style={{
            padding: token.padding,
        }}
        >
        <Avatar
            size={"large"}
            shape="sqaure"
            icon={src ? null : <UserOutlined />}
            src={src}
        />
        <Title level={3} style={{color: "white"}}>{username}</Title>
    </Flex>
}

const SideBar = ({ files }) => {

    const { token } = theme.useToken();

    return <Flex
        vertical
        justify="space-between"
        style={{
            height: "100%",
            backgroundColor: token.colorPrimary,
            borderRight: `${token.lineWidth}px solid ${token.colorBorder}`
        }}>
        <Flex vertical>
            <UserProfile username="username" />
            <FileMenu title="個人筆記" menuKey="indiviual" />
            <FileMenu title="多人協作" menuKey="multiple"/>
        </Flex>
        <ThemeMenu style={{
            borderRadius: token.Menu.itemBorderRadius
        }} />
    </Flex>
}

export default SideBar;