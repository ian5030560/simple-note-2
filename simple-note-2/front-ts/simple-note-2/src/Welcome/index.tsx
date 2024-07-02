import React, { useState } from "react";
import TopBar, { TopBarProp } from "./topbar";
import Brand from "./brand";
import { Flex, ConfigProvider, FloatButton, theme } from "antd";
import Auth from "./Auth";
import { AlertFilled, AlertOutlined } from "@ant-design/icons";
import Intro from "./Intro";
import { switchTheme, defaultSeed } from "../util/theme";

interface HeaderProp extends TopBarProp {
    backgroundColor: string,
}

const Header: React.FC<HeaderProp> = (prop: HeaderProp) => {
    return <Flex
        justify="space-around"
        align="center"
        style={{
            backgroundColor: prop.backgroundColor,
            height: "15%"
        }}>
        <Brand />
        <TopBar
            onIntroClick={prop.onIntroClick}
            onAuthClick={prop.onAuthClick}
        />
    </Flex>
}

export interface BulbButtonProp {
    lighten?: boolean,
    onClick?: React.MouseEventHandler<HTMLElement>
}
export const BulbButton: React.FC<BulbButtonProp> = (prop: BulbButtonProp) => {
    return <FloatButton icon={prop.lighten ? <AlertFilled /> : <AlertOutlined />} onClick={prop.onClick} />
}

const WelcomePage = () => {
    const [darken, setDarken] = useState<boolean>(false);

    return <ConfigProvider
        theme={{
            ...switchTheme(darken, defaultSeed),
            algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
    >
        <Index />
        <BulbButton lighten={!darken} onClick={() => setDarken(!darken)} />
    </ConfigProvider>
}


const Index: React.FC = () => {

    const [content, setContent] = useState<React.JSX.Element>(<Intro />);
    const { token } = theme.useToken();

    return <>
        <Header
            backgroundColor={token.colorPrimary}
            onAuthClick={() => setContent(<Auth />)}
            onIntroClick={() => setContent(<Intro />)}
        />
        {content}
    </>
}

export default WelcomePage;