import React from "react";
import { Flex, Space, Avatar, Typography, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
const { Text } = Typography;

const UserProfile = ({ username, src }) => {
    return <Flex align="center" gap="large">
        <Avatar
            size={"large"}
            shape="sqaure"
            icon={src ? null : <UserOutlined />}
            src={src}
        />
        <Text>{username}</Text>
    </Flex>
}

const FileMenu = ({}) => {

    const items = [
        {
            label: "個人筆記",
            key: "indiviual",
            children: [

            ]
        },
        {
            label: "多人協作",
            key: "multiple",
            children: [

            ]
        }
    ]

    return <Menu
        expandIcon={null} 
        mode="inline"
        items={items}
        />
}

const ThemeMenu = () => {
    const items = [
        {
            label: "我的主題",
            key: "theme",
            children: [

            ]
        }
    ]
    return <Menu
        expandIcon={null}
        mode="inline"
        items={items}
    />
}

const InfoSideBar = ({}) => {
    return <Flex vertical justify="space-between">
        <Space direction="vertical">
            <UserProfile username="ian Lee"/>
            <FileMenu/>
        </Space>
        <ThemeMenu/>
    </Flex>
}

export default InfoSideBar;