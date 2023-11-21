import React, { useState } from "react";
import {WelcomeTopBar} from "../component/topbar";
import Brand from "../component/brand";
import { Flex, ConfigProvider, FloatButton } from "antd";
import Authenticate from "../auth/auth";
import {AlertFilled, AlertOutlined} from "@ant-design/icons";

const lightTheme = {
    colorPrimary: "#0080FF",
    colorBgBase: "#FFFFFF",
    colorBorder: "#00FFFF",
    colorTextBase: "#000000"
}

const darkTheme = {
    colorPrimary: "#000000",
    colorBgBase: "#000000",
    colorBorder: "#FF5809",
    colorTextBase: "#FFFFFF",
    Input: {
        addonBg: "#000000",
        activeBorderColor: "#FF5809",
        hoverBorderColor: "#FF5809"
    }
}

const Header = ({backgroundColor, onIntroClick, onAuthClick}) => {
    return <Flex
        justify="space-around"
        align="center"
        style={{
            backgroundColor: backgroundColor,
        }}>
        <Brand />
        <WelcomeTopBar
            onIntroClick={onIntroClick}
            onAuthClick={onAuthClick} />
    </Flex>
}

// const Footer = () => {

// }

const BulbButton = ({lighten, onClick}) => {

    return <FloatButton icon={lighten ? <AlertOutlined/>: <AlertFilled/>} onClick={onClick}/>
}

const Welcome = () => {

    const [content, setContent] = useState();
    const [darken, setDarken] = useState(false);

    const handleClick = () => {
        setDarken(!darken);
    }

    return <ConfigProvider
        theme={{
            token: darken ? darkTheme : lightTheme,
        }}
    >
        <Header
            backgroundColor={darken ? darkTheme.colorBgBase : lightTheme.colorBgBase}
            onAuthClick={() => setContent(<Authenticate/>)}
            onIntroClick={() => setContent()}
        />
        {content}
        <BulbButton lighten={!darken} onClick={handleClick}/>
    </ConfigProvider>
}

export default Welcome;