import React from "react";
import SideBar from "./component/sidebar";
import {Row, Col} from "antd";
import Preview from "./component/preview";

const ThemePage = () => {
    return <Row>
        <Col span={4}><SideBar light={{}} dark={{}}/></Col>
        <Col span={20}><Preview/></Col>
    </Row>
}

export default ThemePage;