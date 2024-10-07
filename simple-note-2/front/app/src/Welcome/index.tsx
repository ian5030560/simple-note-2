import React from "react";
import TopBar from "./topbar";
import Brand from "./brand";
import { Flex, FloatButton, theme } from "antd";
import { AlertFilled, AlertOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useThemeConfig } from "../util/provider";

const Header = () => {
    const { token } = theme.useToken();

    return <Flex justify="space-around" align="center"
        style={{
            backgroundColor: token.colorBgBase, flex: 1,
            borderBottom: "1px solid rgba(253, 253, 253, 0.12)",
        }}>
        <Brand />
        <TopBar/>
    </Flex>
}

export interface BulbButtonProp {
    darken?: boolean,
    onClick?: React.MouseEventHandler<HTMLElement>
}
export const BulbButton: React.FC<BulbButtonProp> = (prop: BulbButtonProp) => {
    return <FloatButton icon={!prop.darken ? <AlertFilled /> : <AlertOutlined />} onClick={prop.onClick} />
}

export default () => {
    const {darken, setDarken} = useThemeConfig();
    const { token } = theme.useToken();

    return <Flex vertical style={{height: "100%"}}>
        <Header />
        <div style={{ backgroundColor: token.colorBgBase, flex: 5}}>
            <Outlet/>
        </div>
        <BulbButton darken={darken} onClick={() => setDarken(!darken)} />
    </Flex>
}