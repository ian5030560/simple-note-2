import React, { useState, useEffect } from "react";
import { Col, Row, Flex, ConfigProvider, theme } from "antd";
import SideBar from "./component/sidebar";
import ToolBar from "./component/toolbar";
import Editor from "./component/editor/editor";
import defaultTheme from "../theme/default";
import changeEditorStyle from "./change";

const UserPage = () => {

    const [darken, setDarken] = useState(false);

    useEffect(() => {
        changeEditorStyle(darken);
    }, [darken]);

    useEffect(() => {
        const listener = () => {
            changeEditorStyle(darken);
        }
        window.onkeydown = listener;
        window.onclick = listener;
        return () => {
            window.removeEventListener("keydown", listener);
            window.removeEventListener("click", listener);
        }
    }, [darken]);

    const handleThemeClick = () => {
        setDarken(prev => !prev);
    }

    return <ConfigProvider
        theme={{
            ...defaultTheme(darken),
            algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}
    >
        <Index
            onThemeClick={handleThemeClick}
        />
    </ConfigProvider>

}

const Index = ({ onThemeClick }) => {

    const { token } = theme.useToken();

    return <Row style={{
        minHeight: "100%",
        backgroundColor: token.colorBgBase
    }}>
        <Col
            span={4}
            style={{
                backgroundColor: token.colorBgBase,
            }}>
            <SideBar />
        </Col>
        <Col span={20}>
            <Flex style={{ width: "100%" }} vertical>
                <ToolBar onThemeClick={onThemeClick} />
                <Editor />
            </Flex>
        </Col>
    </Row>
}

export default UserPage;