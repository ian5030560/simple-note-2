import React, { useState } from "react";
import SideBar from "./SideBar";
import { Row, Col, ConfigProvider, theme } from "antd";
import Preview from "./Preview";
import { BulbButton } from "../Welcome";
import defaultTheme from "../theme/default";

const ThemePage = () => {

    const [pageDarken, setPageDarken] = useState(false);

    return <ConfigProvider
        theme={{
            algorithm: pageDarken ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}
    >
        <Index />
        <BulbButton lighten={!pageDarken} onClick={() => setPageDarken(prev => !prev)} />
    </ConfigProvider>

}


const Index = () => {
    const [darken, setDarken] = useState(false);
    const [lightPrimary, setLightPrimary] = useState(defaultTheme(false).token!.colorPrimary!);
    const [lightNeutral, setLightNeutral] = useState(defaultTheme(false).token!.colorBgBase!);
    const [darkPrimary, setDarkPrimary] = useState(defaultTheme(true).token!.colorPrimary!);
    const [darkNeutral, setDarkNeutral] = useState(defaultTheme(true).token!.colorBgBase!);
    const { token } = theme.useToken();

    const handleColor = (color: string, setColor: React.Dispatch<React.SetStateAction<string>>) => {
        setColor(() => color);
    }

    return <Row style={{ minHeight: "100%", backgroundColor: token.colorBgBase }}>
        <Col span={6}>
            <SideBar light={{
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