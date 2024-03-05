import { Menu, theme } from "antd";

const ThemeMenu = () => {

    const {token} = theme.useToken();

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
        style={{borderRadius: token.Menu ? token.Menu.itemBorderRadius : 8}}
    />
}

export default ThemeMenu;