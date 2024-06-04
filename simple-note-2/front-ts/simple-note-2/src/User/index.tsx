import React, { useMemo, useState } from "react";
import { ConfigProvider, theme, Button, Grid, Drawer, Layout } from "antd";
import SideBar from "./SideBar";
import Editor from "../Editor";
import { BulbButton } from "../Welcome";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import styles from "./index.module.css";
import { switchTheme } from "../theme";
import { useInfoContext } from "./SideBar/info";

const User: React.FC = () => {

    const [darken, setDarken] = useState(false);
    const { themes } = useInfoContext();

    const seed = useMemo(() => themes?.find(theme => theme.data.isUsing), [themes]);

    return <ConfigProvider
        theme={{
            ...switchTheme(darken, seed?.data),
            algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}
    >
        <Index />
        <BulbButton lighten={!darken} onClick={() => setDarken(prev => !prev)} />
    </ConfigProvider>

}

const { useBreakpoint } = Grid;
const { Sider, Content } = Layout;
interface IndexProp {
    rootStyle?: React.CSSProperties,
}
export const Index: React.FC<IndexProp> = ({ rootStyle }) => {

    const [collapse, setCollapse] = useState(false);
    const { lg } = useBreakpoint();
    const { token } = theme.useToken();

    const context = useMemo(() => <SideBar className={styles.sideBar} />, []);

    return <Layout style={{ minHeight: "100%", ...rootStyle }}>
        <Sider collapsible trigger={null} collapsedWidth={0} width={250}
            collapsed={collapse} style={{ display: !lg ? "none" : "block" }}>
            {context}
        </Sider>
        <Drawer open={!collapse && !lg} onClick={() => setCollapse(true)} placement="left" width={300}
            styles={{
                header: { backgroundColor: token.colorPrimary },
                body: { backgroundColor: token.colorPrimary, padding: 0 },
            }}>
            {context}
        </Drawer>
        <Content style={{ position: "relative" }}>
            <Button type="primary" icon={!collapse ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
                className={`${styles.button} ${!collapse ? styles.collapsedButton : styles['collapsedButton-collapsing']}`}
                onClick={() => setCollapse(prev => !prev)} size="large" />
            <Editor />
        </Content>
    </Layout>
}

export default User;