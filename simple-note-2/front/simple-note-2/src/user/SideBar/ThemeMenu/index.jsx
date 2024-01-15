import React from "react"
import { Menu } from "antd";

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

export default ThemeMenu;