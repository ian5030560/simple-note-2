import React from "react";
import {Col, Row, Flex} from "antd";
import InfoSideBar from "../component/info";
import { FunctionTopBar } from "../component/topbar";
import Editor from "../editor/editor";

const UserPage = () => {
    return <Row style={{height: "100%", padding: "10px"}}>
        <Col span={6}>
            <InfoSideBar/>
        </Col>
        <Col span={18}>
            <Flex style={{width: "100%"}} vertical>
                <FunctionTopBar/>
                <Editor/>
            </Flex>
        </Col>
    </Row>
}

export default UserPage;