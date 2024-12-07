import React, { useCallback, useState } from "react";
import {
    Switch, Typography, theme, Row, Col, ColorPicker, Flex, Button,
    Modal, Input, List
} from "antd";
import styles from "./sideBar.module.css";
import { SwitchClickEventHandler } from "antd/es/switch";
import { Color } from "antd/es/color-picker";
import { Link } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { Arrow90degLeft } from "../util/icons";

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
            <Title level={4}>{title}</Title>
            <Text type="secondary">{decription}</Text>
        </Col>
    </Row>
};

type ThemeSeedDataType = {
    primary?: string,
    neutral?: string,
    onPrimaryChange: (color: string) => void,
    onNeutralChange: (color: string) => void,
}

type ColorHandler = (color: Color) => void;

type ColorDataSourceItem = {
    title: string;
    value: string;
    description: string;
}

export type ExportValues = { lightPrimary: string; lightNeutral: string; darkPrimary: string; darkNeutral: string };

interface SideBarProps {
    light: ThemeSeedDataType;
    dark: ThemeSeedDataType;
    onDarken: SwitchClickEventHandler;
    onExport: (name: string, values: ExportValues) => void;

}
const SideBar = ({ light, dark, onDarken, onExport }: SideBarProps) => {
    const { token } = theme.useToken();
    const [lightPrimary, setLightPrimary] = useState(light.primary ? light.primary : token.colorPrimary);
    const [lightNeutral, setLightNeutral] = useState(light.neutral ? light.neutral : token.colorBgBase);
    const [darkPrimary, setDarkPrimary] = useState(dark.primary ? dark.primary : token.colorPrimary);
    const [darkNeutral, setDarkNeutral] = useState(dark.neutral ? dark.neutral : token.colorBgBase);
    const [input, setInput] = useState("");
    const [_export, setExport] = useState(false);

    const handleLightPrimary: ColorHandler = (color) => {
        setLightPrimary(color.toHexString());
        light.onPrimaryChange(color.toHexString());
    };

    const handleLightNeutral: ColorHandler = (color) => {
        setLightNeutral(color.toHexString());
        light.onNeutralChange(color.toHexString());
    };

    const handleDarkPrimary: ColorHandler = (color) => {
        setDarkPrimary(color.toHexString());
        dark.onPrimaryChange(color.toHexString());
    }

    const handleDarkNeutral: ColorHandler = (color) => {
        setDarkNeutral(color.toHexString());
        dark.onNeutralChange(color.toHexString());
    }

    const clear = () => {
        setExport(false);
        setInput("");
    }

    const source: ColorDataSourceItem[] = [
        { title: "亮系主題色", value: lightPrimary, description: "代表網頁在明亮模式的主題色，用於導航欄、按鈕、進度條等" },
        { title: "亮系中性色", value: lightNeutral, description: "代表網頁在明亮模式的中性色，用於背景、容器、卡片等" },
        { title: "暗系主題色", value: darkPrimary, description: "代表網頁在深色模式的主題色，用於導航欄、按鈕、進度條等" },
        { title: "暗系中性色", value: darkNeutral, description: "代表網頁在深色模式的中性色，用於背景、容器、卡片等" }
    ]

    const handleOk = useCallback(() => {
        clear();
        if (input.trim().length === 0) return;
        onExport(input, { lightPrimary, lightNeutral, darkPrimary, darkNeutral });
    }, [darkNeutral, darkPrimary, input, lightNeutral, lightPrimary, onExport]);

    return <Flex vertical justify="center" style={{ padding: "1em" }}>
        <div style={{fontSize: "1.5em"}}>
            <Link to={"/note"} replace style={{display: "flex", gap: 8, alignItems: "center"}}>
                <span><Arrow90degLeft /></span>
                <span>返回</span>
            </Link>
        </div>
        <Flex justify="end" align="center" style={{ padding: token.padding, paddingBottom: "0px" }}>
            <Button type="primary" icon={<UploadOutlined />} style={{ marginRight: 8 }} onClick={() => setExport(true)}>輸出</Button>
            <Switch unCheckedChildren="亮" checkedChildren="暗" onClick={onDarken} />
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

        <Modal open={_export} title="輸出主題" okText="確認" cancelText="取消" onCancel={clear} onOk={handleOk}>
            <Flex vertical gap={8}>
                <Input placeholder="輸入主題名稱" value={input} onChange={(e) => setInput(e.target.value)} />
                <List header={<h3>主題顏色</h3>} bordered dataSource={source}
                    renderItem={(item) => <List.Item>
                        <List.Item.Meta avatar={<div className={styles.colorCircle} style={{ backgroundColor: item.value }} />}
                            title={<Typography.Text>{item.title}</Typography.Text>}
                            description={<Typography.Text type="secondary">{item.description}</Typography.Text>}
                        />
                    </List.Item>} />
            </Flex>

        </Modal>
    </Flex>
};


export default SideBar;