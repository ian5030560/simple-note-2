import React, { useState } from "react";
import { Menu, Typography, theme } from "antd";
import { GithubOutlined, StarFilled } from "@ant-design/icons";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

const { Text } = Typography;

export interface TopBarProp {
    onIntroClick?: () => void,
    onAuthClick?: () => void
}

const TopBar: React.FC<TopBarProp> = (prop: TopBarProp) => {

    const [current, setCurrent] = useState<string[]>(["intro"]);
    const { token } = theme.useToken();

    const handleClick: MenuClickEventHandler = (e) => {
        switch (e.key) {
            case "intro":
                prop.onIntroClick?.();
                break;
            case "sign-in/sign-up":
                prop.onAuthClick?.();
                break;
            default:
                break;
        }
        setCurrent(() => [e.key]);
    }

    const items: ItemType<MenuItemType>[] = [
        {
            label: "介紹",
            key: "intro",
            // style: {color: "white"}
        },
        {
            label: "團隊",
            key: "team",    
            children: [
                {
                    label: <a href="https://www.instagram.com/0z3.1415926/"><Text>林立山</Text></a>,
                    key: "leader",
                    icon: <StarFilled />,
                },
                {
                    label: <a href="https://www.instagram.com/itsuki_f6/"><Text>蔡岳哲</Text></a>,
                    key: "mate1",
                },
                {
                    label: <Text>李泓逸</Text>,
                    key: "mate2",
                }
            ],
            // style: {color: "white"}
        },
        {
            label: <a href="https://github.com/ian5030560/simple-note-2">github</a>,
            key: "github",
            icon: <GithubOutlined />,
            // style: {color: "white"}
        },
        {
            label: "登入/註冊",
            key: "sign-in/sign-up",
            // style: {color: "white"}
        }
    ]

    return <Menu items={items} mode="horizontal"
        onClick={handleClick} triggerSubMenuAction="click"
        selectedKeys={current}
        style={{
            justifyContent: "flex-end",
            // backgroundColor: token.colorPrimary
        }} />
}

export default TopBar