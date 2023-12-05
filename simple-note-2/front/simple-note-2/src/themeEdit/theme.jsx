import React, { useState } from "react";
import SideBar from "./component/sidebar";
import { Row, Col, ConfigProvider, theme } from "antd";
import Preview from "./component/preview";
import defaultTheme from "../theme/default";
import { BulbButton } from "../welcome/welcome";

const ThemePage = () => {

    const [darken, setDarken] = useState(false);
    const [lightPrimary, setLightPrimary] = useState("#8696A7");
    const [lightNeutral, setLightNeutral] = useState("#FFFCEC");
    const [darkPrimary, setDarkPrimary] = useState("#8696A7");
    const [darkNeutral, setDarkNeutral] = useState("#3C3C3C");

    const handleColor = () => {
        
    }

    return <ConfigProvider
        theme={{
            token: {
                colorPrimary: darken? darkPrimary: lightPrimary,
                colorBgBase: darken ? darkNeutral : lightNeutral
            },
            components: {
                Menu: {
                    itemBg: darken? darkPrimary: lightPrimary,
                    itemColor: "#FFFFFF",
                    itemHoverColor: "#FFFFFF",
                    horizontalItemSelectedColor: "#FFFFFF",
                }
            },
            algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}
    >
        <Row style={{ minHeight: "100%" }}>
            <Col span={6}>
                <SideBar light={{
                    primary: lightPrimary,
                    neutral: lightNeutral,
                }} dark={{
                    primary: darkPrimary,
                    neutral: darkNeutral
                }} />
            </Col>
            <Col span={18}><Preview darken={darken} /></Col>
        </Row>

        {/* <BulbButton lighten={!darken}/> */}
    </ConfigProvider>
}

export default ThemePage;