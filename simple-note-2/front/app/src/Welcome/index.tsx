import TopBar from "./topbar";
import Brand from "./brand";
import { Flex, theme } from "antd";
import { Outlet } from "react-router-dom";
import { ThemeSwitchButton } from "../util/theme";

const Header = () => {
    const { token } = theme.useToken();

    return <Flex justify="space-around" align="center"
        style={{
            backgroundColor: token.colorBgBase, flex: 1,
            borderBottom: "1px solid rgba(253, 253, 253, 0.12)",
        }}>
        <Brand />
        <TopBar />
    </Flex>
}

export default () => {
    const { token } = theme.useToken();

    return <Flex vertical style={{ height: "100%" }}>
        <Header />
        <div style={{ backgroundColor: token.colorBgBase, flex: 5 }}>
            <Outlet />
        </div>
        <ThemeSwitchButton />
    </Flex>
}