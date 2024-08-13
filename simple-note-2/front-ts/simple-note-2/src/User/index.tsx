import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ConfigProvider, Layout, theme, Grid } from "antd";
import SideBar from "./SideBar";
import Editor from "../Editor";
import { BulbButton } from "../Welcome";
import styles from "./index.module.css";
import switchTheme, { defaultTheme } from "../util/theme";
import { useInfoContext } from "./SideBar/info";
import { MenuOutlined } from "@ant-design/icons";

const User: React.FC = () => {

    const [darken, setDarken] = useState(false);
    const { themes } = useInfoContext();

    const seed = useMemo(() => themes?.find(theme => theme.data.isUsing), [themes]);

    return <ConfigProvider theme={seed ? switchTheme(seed.data)(darken) : defaultTheme(darken)}>
        <Index />
        <BulbButton lighten={!darken} onClick={() => setDarken(prev => !prev)} />
    </ConfigProvider>

}

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;
interface IndexProp {
    rootStyle?: React.CSSProperties,
}

const MIN = 250;
const MAX = 500;
export const Index: React.FC<IndexProp> = ({ rootStyle }) => {
    const [resizer, setResizer] = useState({ resize: false, width: MIN, start: { x: 0, w: MIN } });
    const { token } = theme.useToken();
    const { md } = useBreakpoint();

    const handlePointerMove = useCallback((e: MouseEvent) => {
        if (!resizer.resize) return;
        let newWidth = e.clientX - resizer.start.x + resizer.start.w;
        setResizer(prev => ({ ...prev, width: newWidth < MIN ? MIN : newWidth > MAX ? MAX : newWidth }));
    }, [resizer.resize, resizer.start]);

    useEffect(() => {
        const handlePointerUp = () => setResizer(prev => ({ ...prev, resize: false, start: { ...prev.start, w: prev.width } }));
        let body = document.body
        body.addEventListener("pointermove", handlePointerMove);
        body.addEventListener("pointerup", handlePointerUp)
        return () => {
            body.removeEventListener("pointermove", handlePointerMove);
            body.removeEventListener("pointerup", handlePointerUp);
        }
    }, [handlePointerMove]);

    return <Layout style={{ minHeight: "100%", ...rootStyle }}>
        <Sider collapsible collapsedWidth={0} theme="light" width={resizer.width}
            trigger={<MenuOutlined />} onCollapse={(collapsed) => { collapsed && setResizer(prev => ({ ...prev, width: MIN })) }}>
            <SideBar className={styles.sideBar} />
        </Sider>
        {md && <div className={styles.resizer} style={{ borderColor: token.colorBorder }}
            onPointerDown={(e) => setResizer(prev => ({ ...prev, resize: true, start: { ...prev.start, x: e.clientX } }))}
            onDoubleClick={() => setResizer(prev => ({
                ...prev,
                width: prev.width === 0 ? MIN : 0,
                start: { ...prev.start, w: MIN }
            }))}
        />
        }
        <Content style={{ position: "relative" }}>
            <Editor />
        </Content>
    </Layout>
}

export default User;