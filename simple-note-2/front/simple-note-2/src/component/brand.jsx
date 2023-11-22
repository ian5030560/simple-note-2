import React from "react";
import {Typography, Flex} from "antd";
import Icon from "@ant-design/icons";
import {ReactComponent as Note} from "../resource/notebook.svg";
const {Title} = Typography;

const NoteIcon = (prop) => <Icon component={Note}  {...prop}/>

const Brand = () => {
    return <Flex align="center" gap="small">
        <NoteIcon style={{fontSize: "64px"}}/>
        <Title level={2} style={{fontFamily: "monospace", color: "#FFFFFF"}} italic>Simple Note 2</Title>
    </Flex>
}

export default Brand;