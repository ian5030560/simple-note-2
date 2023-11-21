import React from "react";
import {Typography, Image, Flex} from "antd";
import TitleImage from "../resource/ac25e66df5b7e9c767f6f87eb9b2cf3e749fcf08.png@942w_1500h_progressive.png";
const {Title} = Typography;

const Brand = () => {
    return <Flex align="center" gap="middle">
        <Image src={TitleImage} width={32} preview={false}/>
        <Title level={2} style={{fontFamily: "monospace"}} italic>Simple Note 2</Title>
    </Flex>
}

export default Brand;