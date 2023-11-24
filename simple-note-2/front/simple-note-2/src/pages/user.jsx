import React, { useState } from "react";
import { Col, Row, Flex, ConfigProvider, theme } from "antd";
import SideBar from "../component/sidebar";
import { ToolBar } from "../component/topbar";
import Editor from "../editor/editor";
import {userTheme} from "../theme/default";   

const UserPage = () => {

    const [darken, setDarken] = useState(false);

    const handleThemeClick = () => {
        setDarken(!darken);
    }

    return <ConfigProvider
        theme={{
            ...userTheme(darken),
            algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}
    >
        <Index onThemeClick={handleThemeClick}/>
    </ConfigProvider>

}

const Index = ({onThemeClick}) => {
    
    const {token} = theme.useToken();

    return <Row style={{
        height: "100%",
        backgroundColor: token.colorBgBase
    }}>
        <Col
            span={6}
            style={{
                backgroundColor: token.colorBgBase,
            }}>
            <SideBar />
        </Col>
        <Col span={18}>
            <Flex style={{ width: "100%" }} vertical>
                <ToolBar onThemeClick={onThemeClick} />
                <Editor />
            </Flex>
        </Col>
    </Row>
}

export default UserPage;