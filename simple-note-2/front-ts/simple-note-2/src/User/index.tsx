import React, { useState } from "react";
import { Col, Row, ConfigProvider, theme, Typography, Modal, notification } from "antd";
import SideBar from "./SideBar";
import Editor from "../Editor";
import defaultTheme from "../theme/default";
import { BulbButton } from "../Welcome";
import User from "../service/user";
import { useCookies } from "react-cookie";

const { Text } = Typography;

const UserPage: React.FC = () => {

    const [darken, setDarken] = useState(false);

    return <ConfigProvider
        theme={{
            ...defaultTheme(darken),
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
        <Col
            span={4}
            style={{
                backgroundColor: token.colorBgBase,
            }}>
            <SideBar />
        </Col>
        <Col span={20}>
            <Editor />
        </Col>
    </Row>
}

export default UserPage;