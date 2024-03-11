import { Modal, Flex, Image, Input, Button, Select, Typography } from "antd"
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import styles from "./index.module.css";

interface SettingPanelProp {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
}
const SettingPanel = (prop: SettingPanelProp) => {

    const [editable, setEditable] = useState(false);

    return <Modal open={prop.open} onCancel={prop.onCancel} onOk={prop.onOk} centered title="設定">
        <Flex className={styles.marginBottom} justify="center">
            <Image width={50} height={50} />
            <Flex align="end" className={styles.marginLeft}>
                <Input type="text" disabled={!editable} />
                <Button className={`${styles.marginLeft} ${styles.button}`} type={editable ? "primary" : "text"}
                    icon={<FaRegEdit size={15} />} onClick={() => setEditable(!editable)} />
            </Flex>
        </Flex>

        <Flex align="center" className={styles.marginBottom} justify="center">
            <Typography.Text className={styles.marginRight}>主題</Typography.Text>
            <Select options={[
                { value: "luck", label: "luck", }
            ]} className={styles.select}/>
        </Flex>

        <Flex justify="center">
            <Typography.Text className={styles.marginRight}>語言</Typography.Text>
            <Select options={[
                { value: "luck", label: "luck", }
            ]} className={styles.select}/>
        </Flex>
    </Modal>
}
export default SettingPanel;