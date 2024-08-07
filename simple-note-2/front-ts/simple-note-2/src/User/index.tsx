import React, { useMemo, useState } from "react";
import { ConfigProvider, Button, Layout } from "antd";
import SideBar from "./SideBar";
import Editor from "../Editor";
import { BulbButton } from "../Welcome";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import styles from "./index.module.css";
import switchTheme, { defaultTheme } from "../util/theme";
import { useInfoContext } from "./SideBar/info";

const User: React.FC = () => {

    const [darken, setDarken] = useState(false);
    const { themes } = useInfoContext();

    const seed = useMemo(() => themes?.find(theme => theme.data.isUsing), [themes]);

    return <ConfigProvider theme={seed ? switchTheme(seed.data)(darken) : defaultTheme(darken)}>
        <Index />
        <BulbButton lighten={!darken} onClick={() => setDarken(prev => !prev)} />
    </ConfigProvider>

}

// const drawer: CSSProperties = {
//     position: "fixed",
//     inset: 0,
//     zIndex: 1000
// }

// const { useBreakpoint } = Grid;
const { Sider, Content } = Layout;
interface IndexProp {
    rootStyle?: React.CSSProperties,
}
export const Index: React.FC<IndexProp> = ({ rootStyle }) => {

    const [collapse, setCollapse] = useState(false);

    return <Layout style={{ minHeight: "100%", ...rootStyle }}>
        <Sider collapsible trigger={null} collapsedWidth={0} width={250} collapsed={collapse} theme="light">
            <div style={{ height: "100%", position: "relative" }}>
                <SideBar className={styles.sideBar} />
                <Button type="primary" icon={!collapse ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
                    className={`${styles.button} ${!collapse ? styles.notCollapsed : styles.collapsed}`}
                    onClick={() => setCollapse(prev => !prev)} size="large" shape="circle" />
            </div>
        </Sider>
        <Content style={{ position: "relative" }}>
            <Editor />
        </Content>
    </Layout>
}

export default User;