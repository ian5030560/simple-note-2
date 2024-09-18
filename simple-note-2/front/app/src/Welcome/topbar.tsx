import React, { useState } from "react";
import { Menu, Typography } from "antd";
import { GithubOutlined, StarFilled } from "@ant-design/icons";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { Link, useLocation } from "react-router-dom";

const { Text } = Typography;

const TopBar = () => {
    const { pathname } = useLocation();
    const [current, setCurrent] = useState<string>(pathname === "/" ? "intro" : "auth");

    const items: ItemType<MenuItemType>[] = [
        {
            label: <Link to="/"><Text>介紹</Text></Link>,
            key: "intro",
        },
        {
            label: <Text>團隊</Text>,
            key: "team",
            children: [
                {
                    label: <Link to="https://www.instagram.com/0z3.1415926/"><Text>林立山</Text></Link>,
                    key: "leader",
                    icon: <StarFilled />,
                },
                {
                    label: <Link to="https://www.instagram.com/itsuki_f6/"><Text>蔡岳哲</Text></Link>,
                    key: "mate1",
                },
                {
                    label: <Text>李泓逸</Text>,
                    key: "mate2",
                }
            ],
        },
        {
            label: <Link to="https://github.com/ian5030560/simple-note-2">github</Link>,
            key: "github",
            icon: <GithubOutlined />,
        },
        {
            label: <Link to="/auth"><Text>登入/註冊</Text></Link>,
            key: "auth",
        }
    ]

    return <Menu items={items} mode="horizontal" triggerSubMenuAction="click"
        style={{ justifyContent: "flex-end" }} selectedKeys={[current]}
        onClick={(e) => setCurrent(e.key)} />
}

export default TopBar