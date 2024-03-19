import React, { useContext, useState } from "react";
import { Col, Row, ConfigProvider, theme, Typography, Modal, notification, ThemeConfig, Button, Grid, Drawer } from "antd";
import SideBar from "./SideBar";
import Editor from "../Editor";
import defaultTheme from "../theme/default";
import { BulbButton } from "../Welcome";
import { useCookies } from "react-cookie";
import ThemeProvider, { ThemeContext } from "../theme";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import styles from "./index.module.css";

const { Text } = Typography;

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
interface UserPageIndexProp {
    rootStyle?: React.CSSProperties,
}
export const Index: React.FC<UserPageIndexProp> = ({ rootStyle }) => {

    const { token } = theme.useToken();
    // const [collapse, setCollapse] = useState(false);
    // const screens = useBreakpoint();
    const [openDrawer, setOpenDrawer] = useState(false);

    return <Row style={{
        minHeight: "100%",
        backgroundColor: token.colorBgBase,
        ...rootStyle
    }}>
        {/* {
            screens.xs && <>
                <Button type="text" icon={<IoMenu />} onClick={() => setOpenDrawer(true)} className={styles.menuButton}/>
                <Drawer onClose={() => setOpenDrawer(false)} open={openDrawer} placement="left" closeIcon={null} styles={{body: {padding: 0}}} width="30%">
                    <SideBar />
                </Drawer>
            </>
        } */}
        {/* {
            screens.sm && <Col sm={4} className={collapse ? styles.collapsed : styles.notCollapsed}>
                <SideBar />
            </Col>
        } */}
        <Col span={4}>
            <SideBar/>
        </Col>
        <Col xs={24} sm={20}>
            <Editor />
        </Col>
    </Row>
}

const UserPage = () => {
    return <ThemeProvider defaultTheme={defaultTheme}>
        <User />
    </ThemeProvider>
}

export default UserPage;