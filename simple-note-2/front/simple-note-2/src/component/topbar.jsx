import React, { useState } from "react";
import { Button, Menu, Flex, Switch, Typography } from "antd";
import { GithubOutlined, StarFilled, RobotOutlined } from "@ant-design/icons";
const {Text} = Typography;

const WelcomeTopBar = ({
    onIntroClick,
    onAuthClick }
) => {

    const [current, setCurrent] = useState([]);
    // const {token} = theme.useToken();

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
                    icon: <StarFilled style={{color: "black"}}/>,
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
        selectedKeys={current}
        style={{ 
            justifyContent: "flex-end"
            }} />
}

const FunctionTopBar = () => {
    return <Flex
        justify="end"
        align="center"
        gap="large"
        style={{width: "100%"}}>
        <Switch checkedChildren="明亮" unCheckedChildren="陰暗" defaultChecked />
        <Button type="primary" shape="circle" icon=<RobotOutlined /> />
        <Button type="primary" size="middle">export</Button>
    </Flex>
}

export { WelcomeTopBar, FunctionTopBar }