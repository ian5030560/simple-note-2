import { Modal, Flex, Image, Button, Select, Typography, SelectProps, theme } from "antd"
import { useCallback, useRef, useState } from "react";
import styles from "./setting.module.css";
import { SyncOutlined, UploadOutlined } from "@ant-design/icons";
import { ButtonProps } from "antd";
import useAPI from "../../util/api";
import useUser from "./useUser";

type UploadProps = Omit<ButtonProps, "type"> & { onUpload: (src: string) => void };
const Upload = ({ onUpload, ...prop }: UploadProps) => {
    const [enter, setEnter] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const { picture } = useUser();

    return <>
        <Flex vertical gap={5} flex={1} justify="center">
            {
                picture ?
                    <>
                        <Image src={picture} />
                        <Button type="dashed" icon={<SyncOutlined />} onClick={() => ref.current?.click()}>更換</Button>
                    </> :
                    <Button icon={<UploadOutlined />} type={enter ? "primary" : "default"}
                        style={{ alignSelf: "center", height: 64, width: 64 }}
                        onMouseEnter={() => setEnter(true)} onMouseLeave={() => setEnter(false)}
                        onClick={() => ref.current?.click()} {...prop}
                    />
            }
        </Flex>

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
    const { username } = useUser();
    const { themes } = useUser();
    const { token } = theme.useToken();
    const update = useRef<{ theme: number, picture: string }>({
        theme: -1,
        picture: "",
    });

    const handleOk = useCallback(async () => {
        const { theme, picture } = update.current;

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

    const options: SelectProps["options"] = themes?.map((item, index) => ({
        value: index,
        label: `${item.name}`,
        item: item.data,
    }));

    return <Modal open={prop.open} onCancel={prop.onCancel} centered title="設定"
        footer={<>
            <Button onClick={prop.onCancel}>取消</Button>
            <Button type="primary" onClick={handleOk}>儲存</Button>
        </>}>

        <Flex gap={10} style={{ width: "100%" }}>
            <Upload onUpload={(src) => { update.current.picture = src }} />
            <Flex vertical flex={2}>
                <Typography.Title level={3} color={token.colorText}
                    style={{ textAlign: "center", marginBottom: 10, flex: 1 }}>
                    {username}
                </Typography.Title>
                <Flex flex={3}>
                    <Flex style={{ width: "100%", height: "fit-content" }} align="center" gap={5} flex={0}>
                        <Typography.Text>主題</Typography.Text>
                        <Select style={{ flex: 1 }} options={options} variant="filled"
                            defaultValue={options?.find(opt => opt.item.isUsing)?.value}
                            optionRender={(prop) => {
                                return <Flex justify="space-between" key={prop.key}>
                                    <Typography.Text>{prop.label}</Typography.Text>
                                    <Flex justify="space-evenly">
                                        {
                                            Object.keys(prop.data.item).map((key, index) => {
                                                return <div key={index} className={styles.color}
                                                    style={{ backgroundColor: prop.data.item[key] }}
                                                ></div>
                                            })
                                        }
                                    </Flex>
                                </Flex>
                            }}
                            onChange={(val) => {
                                if (!options) return;
                                update.current.theme = val as number;
                            }} />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    </Modal>
}
export default SettingModal;