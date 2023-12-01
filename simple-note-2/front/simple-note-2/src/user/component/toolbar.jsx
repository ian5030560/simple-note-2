import React, { useState } from "react";
import {
    Button,
    Flex,
    Switch,
    Typography,
    Dropdown,
    theme
} from "antd";
import {
    DownOutlined,
    FileWordOutlined,
    RobotOutlined
} from "@ant-design/icons";
import { FiletypeJson } from "react-bootstrap-icons";
import { ChatDrawer } from "./drawer";

const { Text } = Typography;

const ToolBar = ({ onThemeClick }) => {

    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);

    const items = [
        {
            label: <Text>json</Text>,
            key: "json",
            icon: <FiletypeJson />
        },
        {
            label: <Text>word</Text>,
            key: "word",
            icon: <FileWordOutlined />
        }
    ]

    return <Flex
        justify="end"
        align="center"
        gap="large"
        style={{
            width: "100%",
            padding: token.padding
        }}>
        <Switch
            checkedChildren="明亮"
            unCheckedChildren="陰暗"
            defaultChecked
            onClick={onThemeClick}
        />
        <Button
            type="primary"
            shape="circle"
            icon=<RobotOutlined />
            onClick={() => setOpen(true)}
        />
        <Dropdown
            trigger="click"
            menu={{ items }}
        >
            <Button type="primary">export<DownOutlined /></Button>
        </Dropdown>
        <ChatDrawer open={open} onClose={() => setOpen(false)} />
    </Flex>
}

export default ToolBar;