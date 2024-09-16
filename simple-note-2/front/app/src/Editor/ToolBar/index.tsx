import { Button, Divider, Flex, Space, theme } from "antd";
import React, { useEffect, useRef, useState } from "react"
import { Plugin } from "../Extension/index";
import styles from "./index.module.css";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import Align from "./Component/align";
import BackgroundColor from "./Component/background";
import { FontColor, FontSize, FontFamily } from "./Component/font";
import Markdown from "./Component/markdown";
import History from "./Component/history";
import Text from "./Component/text";
import Link from "./Component/link";
import List from "./Component/list";
import Table from "./Component/table";

const TOOLS: React.ReactNode[] = [
    <History />,
    <Text />,
    <Markdown />,
    <Align />,
    <List />,
    <Flex gap={"small"}>
        <FontColor />
        <BackgroundColor />
    </Flex>,
    <Flex gap={"small"}>
        <FontSize />
        <FontFamily />
    </Flex>,
    <Flex gap={"small"}>
        <Link />
        <Table />
    </Flex>,
]

const ToolBarPlugin: Plugin = () => {
    const { token } = theme.useToken();
    const [collapse, setCollapse] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);
    const [hide, setHide] = useState(false);

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            const { clientX, clientY } = e;

            if (ref.current) {
                const { x, width } = ref.current.parentElement!.getBoundingClientRect();
                setHide(!(clientX >= x && clientX <= x + width && clientY <= 70));
            }
        }

        function handleMouseLeave() {
            setHide(true);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
        }
    }, []);

    return <div style={{ position: "relative" }} id="toolbar-container">
        <Space className={styles.toolBar} size={3}
            split={<Divider type="vertical" style={{ backgroundColor: token.colorText }} />}
            style={{
                backgroundColor: token.colorBgElevated,
                maxHeight: collapse ? 0 : 50,
                padding: collapse ? 0 : undefined,
            }}>
            {
                TOOLS.map((element, index) => <React.Fragment key={index}>
                    {element}
                </React.Fragment>)
            }
        </Space>
        <Button type="text" ref={ref} onClick={() => setCollapse(prev => !prev)}
            className={!collapse ? styles.collapsedButton : !hide ? styles.collapsedButtonHover : styles.collapsedButtonHide}>
            {collapse ? <DownOutlined /> : <UpOutlined />}
        </Button>
    </div>
}

export default ToolBarPlugin;