import { Modal, Flex, Image, Button, Select, Typography, SelectProps, theme, Empty, Skeleton } from "antd"
import { useCallback, useMemo, useRef, useState } from "react";
import styles from "./setting.module.css";
import useAPI from "../../util/api";
import useUser from "./useUser";
import { Upload as BsUpload } from "react-bootstrap-icons";
import { SyncOutlined } from "@ant-design/icons";

interface UploadProps { onUpload: (src: string) => void };
const Upload = ({ onUpload }: UploadProps) => {
    const ref = useRef<HTMLInputElement>(null);
    const { picture } = useUser();

    return <>
        {
            picture ? <Flex vertical gap={3}>
                <Image src={picture} width={100} height={100} placeholder={<Skeleton.Image />} alt="載入圖片錯誤" />
                <Button type="dashed" icon={<SyncOutlined />} block onClick={() => ref.current?.click()}>更換</Button>
            </Flex> : <Empty imageStyle={{ width: 100, height: 100 }} description={<Button icon={<BsUpload />}
                block type="dashed" onClick={() => ref.current?.click()}>上傳</Button>} />
        }
        <input aria-label="file" type="file" style={{ display: "none" }} ref={ref}
            onChange={() => {
                const files = ref.current?.files;
                if (files && files[0]) {
                    const reader = new FileReader();
                    reader.onload = () => onUpload(reader.result as string);
                    reader.readAsDataURL(files[0]);
                }
            }} />
    </>
}
interface SettingModalProp {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
}
const SettingModal = (prop: SettingModalProp) => {
    const { info } = useAPI();
    const { username, themes } = useUser();
    const { token } = theme.useToken();

    const handleOk = useCallback(async () => {

        // info.update({
        //     username: username, image: picture,
        //     data: {
        //         // theme: {
        //         //     data: {
        //         //         oldName: themes.find(theme => theme.data.isUsing)!.name,
        //         //         newName: themes[theme].name
        //         //     }
        //         // }
        //     }
        // }).then(res => {
        //         if (res.status !== 200) return;
        //         // updateThemeUsage(theme);
        //         updatePicture(picture);
        //         update.current = {
        //             theme: -1,
        //             picture: ""
        //         }
        //     })
        //     .catch((e) => {
        //         console.log(e);
        //     });

        prop.onOk();
    }, [prop]);

    const options: SelectProps["options"] = themes.map(theme => ({
        label: theme.name, value: theme.id, ...theme.data
    }));


    return <Modal open={prop.open} onCancel={prop.onCancel} centered title="設定" footer={<>
        <Button onClick={prop.onCancel}>取消</Button>
        <Button type="primary" onClick={handleOk}>儲存</Button>
    </>}>
        <Flex vertical gap={10}>
            <Flex align="center" gap={16}>
                <Upload onUpload={() => { }} />
                <Flex vertical gap={8}>
                    <Typography.Text strong>使用者名稱</Typography.Text>
                    <Typography.Text type='secondary'>{username}</Typography.Text>
                </Flex>
            </Flex>

            <Flex vertical>
                <Flex vertical>
                    <Typography.Text strong>主題</Typography.Text>
                    <Select options={options} variant="filled"
                        value={themes.find(it => it.using)?.id}
                        optionRender={(prop) => {
                            return <Flex justify="space-between" key={prop.key}>
                                <Typography.Text>{prop.label}</Typography.Text>
                                <Flex justify="space-evenly">
                                    {
                                        Object.keys(prop.data).map((key, index) => {
                                            return <div key={prop.data[key] + index} className={styles.color}
                                                style={{ backgroundColor: prop.data[key] }}
                                            ></div>
                                        })
                                    }
                                </Flex>
                            </Flex>
                        }}
                        onChange={(val) => {
                            if (!options) return;

                        }} />
                </Flex>
            </Flex>
        </Flex>
    </Modal>
}
export default SettingModal;