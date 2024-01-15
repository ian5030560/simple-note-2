import React, { useState } from "react";
import SideBar from "./SideBar";
import { Row, Col, ConfigProvider, theme } from "antd";
import Preview from "./Preview";
import { BulbButton } from "../Welcome";
import { determineWhiteOrBlack } from "../util/color";

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
    const [lightPrimary, setLightPrimary] = useState("#8696A7");
    const [lightNeutral, setLightNeutral] = useState("#FFFCEC");
    const [darkPrimary, setDarkPrimary] = useState("#8696A7");
    const [darkNeutral, setDarkNeutral] = useState("#3C3C3C");
    const { token } = theme.useToken();

    const handleColor = (color, setColor) => {
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
        <Col span={18}><Preview
            theme={{
                token: {
                    colorPrimary: darken ? darkPrimary : lightPrimary,
                    colorBgBase: darken ? darkNeutral : lightNeutral
                },
                components: {
                    Menu: {
                        itemBg: darken ? darkPrimary : lightPrimary,
                        itemColor: determineWhiteOrBlack(darken ? darkPrimary : lightPrimary),
                        itemHoverColor: determineWhiteOrBlack(darken ? darkPrimary : lightPrimary),
                    }
                },
                algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }} />
        </Col>
    </Row>
}
export default ThemePage;