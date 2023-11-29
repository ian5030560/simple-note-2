import React, { useState } from "react";
import {
    Flex,
    Typography,
    theme,
    Row,
    Col,
    ColorPicker,
    Space
} from "antd";
const { Text, Title } = Typography;


const ColorBar = ({ color, title, decription, onChange }) => {

    return <Row>
        <Col span={6}>
            <ColorPicker defaultValue={color} onChange={onChange} size="large" />
        </Col>
        <Col span={18}>
            <Title level={3}>{title}</Title>
            <Text>{decription}</Text>
        </Col>
    </Row>
};

const ThemeDataType = {
    primary: "",
    neutral: "",
    /**
     * 
     * @param {string} color 
     */
    onPrimaryChange: (color) => {},
    /**
     * 
     * @param {string} color 
     */
    onNeutralChange: (color) => {},
}

/**
 * 
 * @param {{light: ThemeDataType, dark: ThemeDataType}} param0 
 * @returns 
 */
const SideBar = ({ light, dark }) => {

    const {token} = theme.useToken();
    const [lightprimary, setLightPrimary] = useState(light.primary? light.primary: token);
    const [lightneutral, setLightNeutral] = useState(light.neutral? light.neutral: token);
    const [darkPrimary, setDarkPrimary] = useState(dark.primary? dark.primary: token);
    const [darkNeutral, setDarkNeutral] = useState(dark.neutral? dark.neutral: token);

    const handleLightPrimary = (color) => {
        setLightPrimary(color.toHexString());
        light.onPrimaryChange?.(color);
    };

    const handleLightNeutral = (color) => {
        setLightNeutral(color.toHexString());
        light.onNeutralChange?.(color);
    };

    const handleDarkPrimary = (color) => {
        setDarkPrimary(color.toHexString());
        dark.onPrimaryChange?.(color);
    }

    const handleDarkNeutral = (color) => {
        setDarkNeutral(color.toHexString());
        dark.onNeutralChange?.(color);
    }

    return <Flex vertical>
        <Title>Color</Title>
        <Space direction="vertical">
            <ColorBar color={lightprimary} title="LightPrimary"
                decription="Acts as custom source color for light theme"
                onChange={handleLightPrimary} />
            <ColorBar color={lightneutral} title="LightNeutral"
                decription="Used for background and surfaces for light theme"
                onChange={handleLightNeutral} />
            <ColorBar color={darkPrimary} title="DarkPrimary"
                decription="Acts as custom source color for dark theme"
                onChange={handleDarkPrimary} />
            <ColorBar color={darkNeutral} title="DarkNeutral"
                decription="Used for background and surfaces for dark theme"
                onChange={handleDarkNeutral} />
        </Space>
    </Flex>
};


export default SideBar;