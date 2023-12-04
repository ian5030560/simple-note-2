import React from "react";
import SideBar from "./component/sidebar";
import {Row, Col} from "antd";
import Preview from "./component/preview";

const ThemePage = () => {
    return <Row style={{minHeight: "100%"}}>
        <Col span={6}><SideBar light={{}} dark={{}}/></Col>
        <Col span={18}><Preview/></Col>
    </Row>
}

export default ThemePage;