import React, { useCallback, useEffect, useState } from "react";
import { Layout, theme, Grid } from "antd";
import SideBar from "./SideBar";
import { BulbButton } from "../Welcome";
import styles from "./index.module.css";
import { DoubleLeftOutlined } from "@ant-design/icons";
import { ThemeConfigProvider, useThemeConfig } from "../util/provider";

export default function User({ children }: { children?: React.ReactNode }) {

    const {darken, setDarken} = useThemeConfig();

    return <ThemeConfigProvider>
        <Index>{children}</Index>
        <BulbButton darken={darken} onClick={() => setDarken(!darken)} />
    </ThemeConfigProvider>;
}


const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;
interface IndexProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const MIN = 250;
const MAX = 500;
export const Index = (props: IndexProps) => {
    const [resizer, setResizer] = useState({ resize: false, width: MIN, start: { x: 0, w: MIN } });
    const { token } = theme.useToken();
    const { md } = useBreakpoint();
    const [collpase, setCollapase] = useState(false);

    const handlePointerMove = useCallback((e: MouseEvent) => {
        if (!resizer.resize) return;
        const newWidth = e.clientX - resizer.start.x + resizer.start.w;
        setResizer(prev => ({ ...prev, width: newWidth < MIN ? MIN : newWidth > MAX ? MAX : newWidth }));
    }, [resizer.resize, resizer.start]);

    useEffect(() => {
        const body = document.body
        const handlePointerUp = () => {
            body.style.removeProperty("user-select");
            setResizer(prev => ({ ...prev, resize: false, start: { ...prev.start, w: prev.width } }))
        };
        body.addEventListener("pointermove", handlePointerMove);
        body.addEventListener("pointerup", handlePointerUp)
        return () => {
            body.removeEventListener("pointermove", handlePointerMove);
            body.removeEventListener("pointerup", handlePointerUp);
        }
    }, [handlePointerMove]);

    const handleCollapse = useCallback((value: boolean) => {
        if (value) {
            setResizer(prev => ({ ...prev, width: MIN }));
        }
        setCollapase(value);
    }, []);

    return <Layout style={{ height: "100%", ...props.style }}>
        <Sider collapsible collapsedWidth={0} theme="light" width={resizer.width}
            trigger={<DoubleLeftOutlined style={{ transform: collpase ? "rotate(180deg)" : undefined, transition: "transform 300ms ease" }} />}
            onCollapse={handleCollapse}>
            <SideBar />
        </Sider>
        {
            md && <div className={styles.resizer} style={{ backgroundColor: token.colorBorder }}
                onPointerDown={(e) => {
                    document.body.style.userSelect = "none"
                    setResizer(prev => ({ ...prev, resize: true, start: { ...prev.start, x: e.clientX } }))
                }} />
        }
        <Content>
            {props.children}
        </Content>
    </Layout>
}