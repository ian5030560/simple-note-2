import React, { useContext, useState } from "react";
import { ConfigProvider, theme, Button, Grid, Drawer, Layout } from "antd";
import SideBar from "./SideBar";
import Editor from "../Editor";
import defaultTheme from "../theme/default";
import { BulbButton } from "../Welcome";
import { useCookies } from "react-cookie";
import ThemeProvider, { ThemeContext } from "../theme";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import styles from "./index.module.css";

const User: React.FC = () => {

    const [darken, setDarken] = useState(false);
    const context = useContext(ThemeContext);

    return <ConfigProvider
        theme={{
            ...context?.theme(darken),
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

    return <Layout style={{ minHeight: "100%", ...rootStyle }}>
        {
            lg ? <Sider collapsible trigger={null} collapsedWidth={0} collapsed={collapse}>
                <SideBar className={styles.sideBar} />
            </Sider> :
                <Drawer open={!collapse} onClick={() => setCollapse(true)} placement="left"
                    styles={{
                        header: {
                            backgroundColor: token.colorPrimary,
                        },
                        body: { padding: 0 }
                    }}>
                    <SideBar className={styles.sideBar}/>
                </Drawer>
        }

        <Content style={{ position: "relative" }}>
            <Button type="primary" icon={!collapse ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
                className={`${styles.button} ${!collapse ? styles.collapsedButton : styles['collapsedButton-collapsing']}`}
                onClick={() => setCollapse(prev => !prev)} size="large"/>
            <Editor />
        </Content>
    </Layout>
}

const UserPage = () => {
    return <ThemeProvider defaultTheme={defaultTheme}>
        <User />
    </ThemeProvider>
}

export default UserPage;