import React, { useState } from "react";
import { Menu } from "antd";
import { GithubOutlined, StarFilled } from "@ant-design/icons";

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
                    label: <a href="https://www.instagram.com/0z3.1415926/">林立山</a>,
                    key: "leader",
                    icon: <StarFilled />
                },
                {
                    label: <a href="https://www.instagram.com/itsuki_f6/">蔡岳哲</a>,
                    key: "mate1",
                },
                {
                    label: "李泓逸",
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
        style={{ justifyContent: "flex-end" }}/>
}

export {WelcomeTopBar}