import React, { useState } from "react";
import {
    Switch,
    Typography,
    theme,
    Row,
    Col,
    ColorPicker,
    Space,
    Flex,
} from "antd";
import { Color } from "antd/es/color-picker/color"
import { SwitchClickEventHandler } from "antd/es/switch";
const { Text, Title } = Typography;

interface ColorBarProp {
    color: string,
    title: string,
    decription: string,
    onChange: (value: Color, hex: string) => void,
}
const ColorBar: React.FC<ColorBarProp> = ({ color, title, decription, onChange }) => {

    return <Row align={"middle"}>
        <Col span={6} style={{ textAlign: "center" }}>
            <ColorPicker defaultValue={color} onChange={onChange} size="large" />
        </Col>
        <Col span={18}>
            <Title level={3}>{title}</Title>
            <Text>{decription}</Text>
        </Col>
    </Row>
};

type ThemeDataType = {
    primary?: string,
    neutral?: string,
    onPrimaryChange: (color: string) => void,
    onNeutralChange: (color: string) => void,
}

type ColorHandler = (color: Color) => void;

interface SideBarProp {
    light: ThemeDataType,
    dark: ThemeDataType,
    onDarkenClick: SwitchClickEventHandler,
}
const SideBar: React.FC<SideBarProp> = ({ light, dark, onDarkenClick }) => {

    const { token } = theme.useToken();
    const [lightprimary, setLightPrimary] = useState(light.primary ? light.primary : token.colorPrimary);
    const [lightneutral, setLightNeutral] = useState(light.neutral ? light.neutral : token.colorBgBase);
    const [darkPrimary, setDarkPrimary] = useState(dark.primary ? dark.primary : token.colorPrimary);
    const [darkNeutral, setDarkNeutral] = useState(dark.neutral ? dark.neutral : token.colorBgBase);

    const handleLightPrimary: ColorHandler = (color) => {
        setLightPrimary(color.toHexString());
        light.onPrimaryChange?.(color.toHexString());
    };

    const handleLightNeutral: ColorHandler = (color) => {
        setLightNeutral(color.toHexString());
        light.onNeutralChange?.(color.toHexString());
    };

    const handleDarkPrimary: ColorHandler = (color) => {
        setDarkPrimary(color.toHexString());
        dark.onPrimaryChange?.(color.toHexString());
    }

    const handleDarkNeutral: ColorHandler = (color) => {
        setDarkNeutral(color.toHexString());
        dark.onNeutralChange?.(color.toHexString());
    }

    return <Space direction="vertical">

        <Flex justify="end" align="center" style={{ padding: token.padding, paddingBottom: "0px" }}>
            <Switch unCheckedChildren="亮" checkedChildren="暗" onClick={onDarkenClick} />
        </Flex>

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
};


export default SideBar;