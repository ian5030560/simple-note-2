import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ConfigProvider, Layout, theme, Grid } from "antd";
import SideBar from "./SideBar";
import Editor from "../Editor";
import { BulbButton } from "../Welcome";
import styles from "./index.module.css";
import switchTheme, { defaultTheme } from "../util/theme";
import { useInfoContext } from "./SideBar/info";
import { DoubleLeftOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";

export default function User() {

    const [darken, setDarken] = useState(false);
    const { themes } = useInfoContext();

    const seed = useMemo(() => themes?.find(theme => theme.data.isUsing), [themes]);

    return <ConfigProvider theme={seed ? switchTheme(seed.data)(darken) : defaultTheme(darken)}>
        <Index/>
        <BulbButton lighten={!darken} onClick={() => setDarken(prev => !prev)} />
    </ConfigProvider>
}

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;
interface IndexProps {
    style?: React.CSSProperties,
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
            setResizer(prev => ({ ...prev, width: MIN }))
        }
        setCollapase(value);
    }, []);

    return <Layout style={{ height: "100%", ...props.style }}>
        <Sider collapsible collapsedWidth={0} theme="light" width={resizer.width}
            trigger={<DoubleLeftOutlined style={{ transform: collpase ? "rotate(180deg)" : undefined }} />}
            onCollapse={handleCollapse}>
            <SideBar />
        </Sider>
        {md && <div className={styles.resizer} style={{ backgroundColor: token.colorBorder }}
            onPointerDown={(e) => {
                document.body.style.userSelect = "none"
                setResizer(prev => ({ ...prev, resize: true, start: { ...prev.start, x: e.clientX } }))
            }}
            onDoubleClick={() => setResizer(prev => ({ ...prev, width: prev.width === 0 ? MIN : 0, start: { ...prev.start, w: MIN } }))}
        />}
        <Content className={styles.editorFrame}>
            <Editor/>
        </Content>
    </Layout>
}