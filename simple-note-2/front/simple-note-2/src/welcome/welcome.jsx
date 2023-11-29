import React, { useState } from "react";
import TopBar from "./component/topbar";
import Brand from "./component/brand";
import { Flex, ConfigProvider, FloatButton, theme } from "antd";
import Authenticate from "./component/auth";
import { AlertFilled, AlertOutlined } from "@ant-design/icons";
import defaultTheme from "../theme/default";

const Header = ({ backgroundColor, onIntroClick, onAuthClick }) => {
    return <Flex
        justify="space-around"
        align="center"
        style={{
            backgroundColor: backgroundColor,
            height: "15%"
        }}>
        <Brand />
        <TopBar
            onIntroClick={onIntroClick}
            onAuthClick={onAuthClick}   
        />
    </Flex>
}

const BulbButton = ({ lighten, onClick }) => {

    return <FloatButton icon={lighten ? <AlertFilled /> : <AlertOutlined />} onClick={onClick} />
}

const Welcome = () => {
    const [darken, setDarken] = useState(false);

    const handleClick = () => {
        setDarken(!darken);
    }

    return <ConfigProvider
        theme={{
            ...defaultTheme(darken),
            algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
    >
        <Index darken={darken} onDarken={handleClick}/>
    </ConfigProvider>
}

const Index = ({darken, onDarken}) => {

    const [content, setContent] = useState();
    const {token} = theme.useToken();

    return <>
        <Header
            backgroundColor={token.colorPrimary}
            onAuthClick={() => setContent(<Authenticate />)}
            onIntroClick={() => setContent()}
        />
        {content}
        <BulbButton lighten={!darken} onClick={onDarken} />
    </>
}

export default Welcome;