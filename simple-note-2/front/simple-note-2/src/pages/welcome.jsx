import React, { useState } from "react";
import { WelcomeTopBar } from "../component/topbar";
import Brand from "../component/brand";
import { Flex, ConfigProvider, FloatButton, theme } from "antd";
import Authenticate from "../auth/auth";
import { AlertFilled, AlertOutlined } from "@ant-design/icons";

const Header = ({ backgroundColor, onIntroClick, onAuthClick }) => {
    return <Flex
        justify="space-around"
        align="center"
        style={{
            backgroundColor: backgroundColor,
            height: "15%"
        }}>
        <Brand />
        <WelcomeTopBar
            onIntroClick={onIntroClick}
            onAuthClick={onAuthClick} />
    </Flex>
}

const BulbButton = ({ lighten, onClick }) => {

    return <FloatButton icon={lighten ? <AlertFilled /> : <AlertOutlined />} onClick={onClick} />
}

const Welcome = () => {

    const [content, setContent] = useState();
    const [darken, setDarken] = useState(false);

    const handleClick = () => {
        setDarken(!darken);
    }

    return <ConfigProvider
        theme={{
            token: {
                colorPrimary: "#9DA9B8",
                colorBgBase: darken? "#3C3C3C":"#FFFCEC"
            },
            components: {
                Menu: {
                    itemBg: "#9DA9B8",
                    itemColor: "#FFFFFF",
                    itemHoverColor: "#FFFFFF",
                    horizontalItemSelectedColor: "#FFFFFF",
                }
            },
            algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm,

        }}
    >
        <Header
            backgroundColor="#9DA9B8"
            onAuthClick={() => setContent(<Authenticate />)}
            onIntroClick={() => setContent()}
        />
        {content}
        <BulbButton lighten={!darken} onClick={handleClick} />
    </ConfigProvider>
}

export default Welcome;