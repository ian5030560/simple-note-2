import React, { useState } from "react";
import SideBar from "./SideBar";
import { Row, Col, ConfigProvider, theme } from "antd";
import Preview from "./Preview";
import { BulbButton } from "../Welcome";
import { defaultSeed } from "../util/theme";
import { ThemeConfigProvider, useThemeConfig } from "../util/loader";

const ThemePage = () => {
    const {darken, setDarken} = useThemeConfig();

    return <ThemeConfigProvider>
        <Index />
        <BulbButton darken={darken} onClick={() => setDarken(!darken)} />
    </ThemeConfigProvider>

}


const Index = () => {
    const [darken, setDarken] = useState(false);
    const [lightPrimary, setLightPrimary] = useState(defaultSeed.colorLightPrimary);
    const [lightNeutral, setLightNeutral] = useState(defaultSeed.colorLightNeutral);
    const [darkPrimary, setDarkPrimary] = useState(defaultSeed.colorDarkPrimary);
    const [darkNeutral, setDarkNeutral] = useState(defaultSeed.colorDarkNeutral);
    const { token } = theme.useToken();

    const handleColor = (color: string, setColor: React.Dispatch<React.SetStateAction<string>>) => {
        setColor(() => color);
    }

    return <Row style={{ minHeight: "100%", backgroundColor: token.colorBgBase }}>
        <Col span={6}>
            <SideBar
                light={{
                    primary: lightPrimary,
                    neutral: lightNeutral,
                    onPrimaryChange: (color) => handleColor(color, setLightPrimary),
                    onNeutralChange: (color) => handleColor(color, setLightNeutral)
                }}
                dark={{
                    primary: darkPrimary,
                    neutral: darkNeutral,
                    onPrimaryChange: (color) => handleColor(color, setDarkPrimary),
                    onNeutralChange: (color) => handleColor(color, setDarkNeutral)
                }}
                onDarkenClick={() => setDarken(prev => !prev)}
            />
        </Col>
        <Col span={18}>
            <Preview theme={{
                token: {
                    colorPrimary: darken ? darkPrimary : lightPrimary,
                    colorBgBase: darken ? darkNeutral : lightNeutral,
                },
                algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }} />
        </Col>
    </Row>
}
export default ThemePage;