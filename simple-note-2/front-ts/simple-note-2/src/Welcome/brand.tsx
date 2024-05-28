import React from "react";
import {Flex, Image} from "antd";
import Note from "../resource/notesbook.png";
import styles from "./index.module.css";

const NoteImage: React.FC = () => <Image src={Note} alt="" width={64} height={64} preview={false}/>

const Brand: React.FC = () => {
    return <Flex align="center" gap="small">
        <NoteImage/>
        <p className={styles["brand-title"]}>Simple Note 2</p>
    </Flex>
}

export default Brand;