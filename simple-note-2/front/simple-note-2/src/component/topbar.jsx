import React, { useState } from "react";
import { 
    Button, 
    Menu, 
    Flex, 
    Switch, 
    Typography, 
    Dropdown,
    theme
} from "antd";
import { 
    GithubOutlined, 
    StarFilled, 
    DownOutlined,
    FileWordOutlined,
    RobotOutlined
} from "@ant-design/icons";
import {FiletypeJson} from "react-bootstrap-icons";
import { ChatDrawer } from "./drawer";

const { Text } = Typography;

const WelcomeTopBar = ({
    onIntroClick,
    onAuthClick }
) => {

    const [current, setCurrent] = useState([]);
    const {token} = theme.useToken();

    const handleClick = (e) => {
        switch (e.key) {
            case "intro":
                onIntroClick?.();
                break;
            case "sign-in/sign-up":
                onAuthClick?.();
                break;
            default:
                break;
        }
        setCurrent(() => [e.key]);
    }

    const items = [
        {
            label: "介紹",
            key: "intro",
        },
        {
            label: "團隊",
            key: "team",
            children: [
                {
                    label: <a href="https://www.instagram.com/0z3.1415926/"><Text>林立山</Text></a>,
                    key: "leader",
                    icon: <StarFilled style={{ color: "black" }} />,
                },
                {
                    label: <a href="https://www.instagram.com/itsuki_f6/"><Text>蔡岳哲</Text></a>,
                    key: "mate1",
                },
                {
                    label: <Text>李泓逸</Text>,
                    key: "mate2",
                }
            ]
        },
        {
            label: <a href="https://github.com/ian5030560/simple-note-2">github</a>,
            key: "github",
            icon: <GithubOutlined />
        },
        {
            label: "登入/註冊",
            key: "sign-in/sign-up"
        }
    ]

    return <Menu
        items={items}
        mode="horizontal"
        onClick={handleClick}
        triggerSubMenuAction="click"
        selectedKeys={current}
        style={{
            justifyContent: "flex-end",
            backgroundColor: token.colorPrimary
        }} />
}

const ToolBar = ({onThemeClick}) => {

    const {token} = theme.useToken();
    const [open, setOpen] = useState(false);

    const items = [
        {
            label: <Text>json</Text>,
            key: "json",
            icon: <FiletypeJson/>
        },
        {
            label: <Text>word</Text>,
            key: "word",
            icon: <FileWordOutlined/>
        }
    ]

    return <Flex
        justify="end"
        align="center"
        gap="large"
        style={{ 
            width: "100%",
            backgroundColor: token.colorPrimary,
            padding: token.padding
        }}>
        <Switch checkedChildren="明亮" unCheckedChildren="陰暗" defaultChecked onClick={onThemeClick}/>
        <Button 
        type="primary" 
        shape="circle" 
        icon=<RobotOutlined/> 
        onClick={() => setOpen(true)}
        />
        <Dropdown
            trigger="click"
            menu={{ items }}
        >
            <Button type="primary">export<DownOutlined/></Button>
        </Dropdown>
        <ChatDrawer open={open} onClose={() => setOpen(false)}/>
    </Flex>
}

export { WelcomeTopBar, ToolBar }