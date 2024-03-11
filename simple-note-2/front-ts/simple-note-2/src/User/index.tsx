import React, { useContext, useState } from "react";
import { Col, Row, ConfigProvider, theme, Typography, Modal, notification, ThemeConfig } from "antd";
import SideBar from "./SideBar";
import Editor from "../Editor";
import defaultTheme from "../theme/default";
import { BulbButton } from "../Welcome";
import { useCookies } from "react-cookie";
import ThemeProvider, { ThemeContext } from "../theme";

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

interface UserPageIndexProp {
    rootStyle?: React.CSSProperties,
}
export const Index: React.FC<UserPageIndexProp> = ({ rootStyle }) => {

    const { token } = theme.useToken();

    return <Row style={{
        minHeight: "100%",
        backgroundColor: token.colorBgBase,
        ...rootStyle
    }}>
        <Col span={4} style={{backgroundColor: token.colorBgBase,}}>
            <SideBar />
        </Col>
        <Col span={20}>
            <Editor />
        </Col>
    </Row>
}

const UserPage = () => {
    return <ThemeProvider defaultTheme={defaultTheme}>
        <User/>
    </ThemeProvider>
}

export default UserPage;