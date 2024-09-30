import React, { useState } from "react";
import TopBar from "./topbar";
import Brand from "./brand";
import { Flex, ConfigProvider, FloatButton, theme } from "antd";
import { AlertFilled, AlertOutlined } from "@ant-design/icons";
import {defaultTheme} from "../util/theme";
import { Outlet } from "react-router-dom";

interface HeaderProp {
    backgroundColor: string;
    flex: number;
}

const Header = (prop: HeaderProp) => {
    return <Flex justify="space-around" align="center"
        style={{
            backgroundColor: prop.backgroundColor,
            borderBottom: "1px solid rgba(253, 253, 253, 0.12)",
            flex: prop.flex
        }}>
        <Brand />
        <TopBar/>
    </Flex>
}

export interface BulbButtonProp {
    lighten?: boolean,
    onClick?: React.MouseEventHandler<HTMLElement>
}
export const BulbButton: React.FC<BulbButtonProp> = (prop: BulbButtonProp) => {
    return <FloatButton icon={prop.lighten ? <AlertFilled /> : <AlertOutlined />} onClick={prop.onClick} />
}

const WelcomeLayout = () => {
    const [darken, setDarken] = useState<boolean>(false);

    return <ConfigProvider theme={defaultTheme(darken)}>
        <Index/>
        <BulbButton lighten={!darken} onClick={() => setDarken(!darken)} />
    </ConfigProvider>
}


const Index = () => {
    const { token } = theme.useToken();

    return <Flex vertical style={{height: "100%"}}>
        <Header backgroundColor={token.colorBgBase} flex={1}/>
        <div style={{ backgroundColor: token.colorBgBase, flex: 5}}>
            <Outlet/>
        </div>
    </Flex>
}

export default WelcomeLayout;