import { Button, Divider, Flex, Space, theme } from "antd";
import React, { useEffect, useRef, useState } from "react"
import styles from "./index.module.css";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import Align from "./align";
import BackgroundColor from "./background";
import { FontColor, FontSize, FontFamily } from "./font";
import Markdown from "./markdown";
import History from "./history";
import Text from "./text";
import Link from "./link";
import List from "./list";
import Table from "./table";
import ComponentPicker from "./componentPicker";

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
    // <ComponentPicker/>
]

export default function ToolBarPlugin(){
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
                // justifyContent: "space-evenly"
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