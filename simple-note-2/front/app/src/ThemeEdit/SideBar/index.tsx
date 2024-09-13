import React, { useRef, useState } from "react";
import {
    Switch, Typography, theme, Row, Col, ColorPicker, Space, Flex, Button,
    message,
    Modal,
    Input,
    InputRef,
} from "antd";

import { SwitchClickEventHandler } from "antd/es/switch";
import { TiExport } from "react-icons/ti";
import { ExclamationCircleFilled } from "@ant-design/icons";
import useAPI, { APIs } from "../../util/api";
import { useCookies } from "react-cookie";
import { Color } from "antd/es/color-picker";

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
    const [lightPrimary, setLightPrimary] = useState(light.primary ? light.primary : token.colorPrimary);
    const [lightNeutral, setLightNeutral] = useState(light.neutral ? light.neutral : token.colorBgBase);
    const [darkPrimary, setDarkPrimary] = useState(dark.primary ? dark.primary : token.colorPrimary);
    const [darkNeutral, setDarkNeutral] = useState(dark.neutral ? dark.neutral : token.colorBgBase);
    const [api, contextHolder] = message.useMessage();
    const { confirm } = Modal;
    const addTheme = useAPI(APIs.addTheme);
    const [{ username }] = useCookies(["username"]);
    const ref = useRef<InputRef>(null);
    
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

    const handleExport = () => {
        confirm({
            title: "新增主題",
            icon: <ExclamationCircleFilled />,
            content: <>
                <Input placeholder="輸入主題名稱" ref={ref}/>
                <ul>
                    <li>{lightPrimary}</li>
                    <li>{lightNeutral}</li>
                    <li>{darkPrimary}</li>
                    <li>{darkNeutral}</li>
                </ul>
            </>,
            okText: "確認",
            cancelText: "取消",
            onOk: () => {
                const name = ref.current?.input?.value;
                addTheme({
                    username: username,
                    theme: {
                        name: name!,
                        data: {
                            colorLightPrimary: lightPrimary,
                            colorLightNeutral: lightNeutral,
                            colorDarkPrimary: darkPrimary,
                            colorDarkNeutral: darkNeutral
                        },
                    }
                })[0]
                    .then(() => {
                        api.success({ content: "新增成功!" });
                    })
                    .catch(() => {
                        api.error({ content: "新增失敗，請重新上傳" })
                    })

                ref.current!.input!.value = "";
            },
            onCancel: () => ref.current!.input!.value = ""
        })
    }

    return <Space direction="vertical">
        <Flex justify="end" align="center" style={{ padding: token.padding, paddingBottom: "0px" }}>
            <Button type="primary" icon={<TiExport />} style={{ marginRight: 8 }} onClick={handleExport}>export</Button>
            <Switch unCheckedChildren="亮" checkedChildren="暗" onClick={onDarkenClick} />
        </Flex>

        <ColorBar color={lightPrimary} title="LightPrimary"
            decription="Acts as custom source color for light theme"
            onChange={handleLightPrimary} />
        <ColorBar color={lightNeutral} title="LightNeutral"
            decription="Used for background and surfaces for light theme"
            onChange={handleLightNeutral} />
        <ColorBar color={darkPrimary} title="DarkPrimary"
            decription="Acts as custom source color for dark theme"
            onChange={handleDarkPrimary} />
        <ColorBar color={darkNeutral} title="DarkNeutral"
            decription="Used for background and surfaces for dark theme"
            onChange={handleDarkNeutral} />
        {contextHolder}
    </Space>
};


export default SideBar;