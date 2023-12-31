import React, { useState } from "react";
import { 
    Menu,  
    Typography, 
    theme
} from "antd";
import { 
    GithubOutlined, 
    StarFilled, 
} from "@ant-design/icons";

const { Text } = Typography;

const TopBar = ({
    onIntroClick,
    onAuthClick 
}) => {

    const [current, setCurrent] = useState(["intro"]);
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

export default TopBar