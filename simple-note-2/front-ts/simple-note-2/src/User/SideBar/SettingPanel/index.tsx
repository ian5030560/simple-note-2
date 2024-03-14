import { Modal, Flex, Image, Input, Button, Select, Typography } from "antd"
import { useCallback, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import styles from "./index.module.css";
import postData from "../../../util/post";

type Info = {
    username: string;
    picture: string;
    themes: {
        colorLightPrimary: string;
        colorLightNeutral: string;
        colorDarkPrimary: string;
        colorDarkNeutral: string;
        isUsing: boolean;
    }[]
}
interface SettingPanelProp {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
}
const SettingPanel = (prop: SettingPanelProp) => {

    const [editable, setEditable] = useState(false);
    const [info, setInfo] = useState<Info>();

    useEffect(() => {
        // postData("http://localhost:8000/get_info/", {
        //     username: "user",
        // })
        // .then(async res => setInfo(await res.json() as Info));
    }, []);

    const handleOk = useCallback(() => {
        // postData("http://localhost:8000/update_info/", {
        //     username: "user",
        //     data: {
                
        //     },
        // })
        // .then(res => console.log(res.status));
        prop.onOk();
    }, [prop]);

    return <Modal open={prop.open} onCancel={prop.onCancel} onOk={handleOk} centered title="設定">
        <Flex className={styles.marginBottom} justify="center">
            <Image width={50} height={50} src = {info?.picture}/>
            <Flex align="end" className={styles.marginLeft}>
                <Input type="text" disabled={!editable} value={info?.username}/>
                <Button className={`${styles.marginLeft} ${styles.button}`} type={editable ? "primary" : "text"}
                    icon={<FaRegEdit size={15} />} onClick={() => setEditable(!editable)} />
            </Flex>
        </Flex>

        <Flex align="center" className={styles.marginBottom} justify="center">
            <Typography.Text className={styles.marginRight}>主題</Typography.Text>
            <Select options={info?.themes.map((theme, index) => ({
                value: {
                    colorLightPrimary: theme.colorLightPrimary,
                    colorLightNeutral: theme.colorLightNeutral,
                    colorDarkPrimary: theme.colorDarkPrimary,
                    colorDarkNeutral: theme.colorDarkNeutral,
                },
                label: `theme ${index}`
            }))} className={styles.select}/>
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