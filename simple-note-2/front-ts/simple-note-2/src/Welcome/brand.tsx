import React from "react";
import {Flex, Image, Typography} from "antd";
import Note from "../resource/notesbook.png";

const NoteImage: React.FC = () => <Image src={Note} alt="" width={64} height={64} preview={false}/>

const Brand: React.FC = () => {
    return <Flex align="center" gap="small">
        <NoteImage/>
        <Typography.Title level={2} style={{fontFamily: "monospace"}}>Simple Note 2</Typography.Title>
    </Flex>
}

export default Brand;