import React, { useCallback, useState } from "react";
import {
    Switch, Typography, theme, Row, Col, ColorPicker, Space, Flex, Button,
    message, Modal, Input,
} from "antd";

import { SwitchClickEventHandler } from "antd/es/switch";
import { TiExport } from "react-icons/ti";
import useAPI from "../../util/api";
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
    const { theme: { add } } = useAPI();
    const [{ username }] = useCookies(["username"]);
    const [input, setInput] = useState("");
    const [_export, setExport] = useState(false);

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

    const handleOk = useCallback(() => {
        // add()
        //     .then(() => {
        //         api.success({ content: "新增成功!" });
        //     })
        //     .catch(() => {
        //         api.error({ content: "新增失敗，請重新上傳" })
        //     })
        setExport(false);
        setInput("");
    }, [add, api]);

    const handleCancel = () => {
        setExport(false);
        setInput("");
    };

    return <Space direction="vertical" style={{ width: "100%", justifyContent: "center" }}>
        <Flex justify="end" align="center" style={{ padding: token.padding, paddingBottom: "0px" }}>
            <Button type="primary" icon={<TiExport />} style={{ marginRight: 8 }} onClick={() => setExport(true)}>輸出</Button>
            <Switch unCheckedChildren="亮" checkedChildren="暗" onClick={onDarkenClick} />
        </Flex>

        <ColorBar color={lightPrimary} title="亮系主題色"
            decription="代表網頁在明亮模式的主題色，用於導航欄、按鈕、進度條等"
            onChange={handleLightPrimary} />
        <ColorBar color={lightNeutral} title="亮系中性色"
            decription="代表網頁在明亮模式的中性色，用於背景、容器、卡片等"
            onChange={handleLightNeutral} />
        <ColorBar color={darkPrimary} title="暗系主題色"
            decription="代表網頁在深色模式的主題色，用於導航欄、按鈕、進度條等"
            onChange={handleDarkPrimary} />
        <ColorBar color={darkNeutral} title="暗系中性色"
            decription="代表網頁在深色模式的中性色，用於背景、容器、卡片等"
            onChange={handleDarkNeutral} />

        <Modal open={_export} title="新增主題" okText="確認" cancelText="取消" onOk={handleOk}
            onCancel={handleCancel}>
            <Input placeholder="輸入主題名稱" value={input} onChange={(e) => setInput(e.target.value)} />
            <ul>
                <li>{lightPrimary}</li>
                <li>{lightNeutral}</li>
                <li>{darkPrimary}</li>
                <li>{darkNeutral}</li>
            </ul>
        </Modal>

        {contextHolder}
    </Space>
};


export default SideBar;