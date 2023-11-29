import React, { useState } from "react";
import {
    Flex,
    Avatar,
    Typography,
    theme,
    Row,
    Col,
    ColorPicker,
    Space
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ThemeMenu, FileMenu } from "./menu";
const { Text, Title } = Typography;

const UserProfile = ({ username, src }) => {

    const { token } = theme.useToken();

    return <Flex
        align="center"
        gap="large"
        style={{
            padding: token.padding,
        }}
    >
        <Avatar
            size={"large"}
            shape="sqaure"
            icon={src ? null : <UserOutlined />}
            src={src}
        />
        <Title level={3} style={{ color: "white" }}>{username}</Title>
    </Flex>
}

const SideBar = ({ files }) => {

    const { token } = theme.useToken();

    return <Flex
        vertical
        justify="space-between"
        style={{
            height: "100%",
            backgroundColor: token.colorPrimary,
            borderRight: `${token.lineWidth}px solid ${token.colorBorder}`,
            overflow: "auto",
        }}>
        <Flex vertical>
            <UserProfile username="username" />
            <FileMenu />
        </Flex>
        <ThemeMenu style={{
            borderRadius: token.Menu.itemBorderRadius
        }} />
    </Flex>
}

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
const ColorSideBar = ({ light, dark }) => {

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
export { ColorSideBar }