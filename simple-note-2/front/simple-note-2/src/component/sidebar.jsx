import React from "react";
import { 
    Flex, 
    Avatar, 
    Typography, 
    Menu, 
    theme
} from "antd";
import { UserOutlined } from "@ant-design/icons";
const { Text } = Typography;

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
        <Text>{username}</Text>
    </Flex>
}

const FileMenu = ({ style }) => {

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
        style={style}
    />
}

const ThemeMenu = ({ style }) => {
    const items = [
        {
            label: "我的主題",
            key: "theme",
            children: [

            ]
        }
    ]
    return <Menu
        mode="vertical"
        items={items}
        style={style}
    />
}

const SideBar = ({ files }) => {

    const { token } = theme.useToken();

    return <Flex
        vertical
        justify="space-between"
        style={{
            height: "100%",
            backgroundColor: token.colorBgBase,
            borderRight: `${token.lineWidth}px solid ${token.colorBorder}`
        }}>
        <Flex vertical>
            <UserProfile username="username" />
            <FileMenu style={{
                borderRadius: token.Menu.itemBorderRadius
            }} />
        </Flex>
        <ThemeMenu style={{
            borderRadius: token.Menu.itemBorderRadius
        }} />
    </Flex>
}

export default SideBar;