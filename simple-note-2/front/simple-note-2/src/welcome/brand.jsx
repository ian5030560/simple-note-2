import React from "react";
import {Typography, Flex, Image} from "antd";
import Note from "../resource/notesbook.png";
const {Title} = Typography;

const NoteImage = () => <Image src={Note} alt="" width={64} height={64} preview={false}/>

const Brand = () => {
    return <Flex align="center" gap="small">
        <NoteImage/>
        <Title level={2} style={{fontFamily: "monospace", color: "#FFFFFF"}}>Simple Note 2</Title>
    </Flex>
}

export default Brand;