import { Modal, Flex, Image, Input, Button, Select, Typography, InputRef, SelectProps } from "antd"
import { useCallback, useRef, useState } from "react";
import styles from "./index.module.css";
import useAPI, { APIs } from "../../../util/api";
import { useInfoAction, useInfoContext } from "../info";
import { useCookies } from "react-cookie";
import { UploadOutlined } from "@ant-design/icons";
import { ButtonProps } from "antd";

type UploadProps = Omit<ButtonProps, "type"> & { onUpload: (src: string) => void };
const Upload = ({ onUpload, ...prop }: UploadProps) => {
    const [enter, setEnter] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const { picture } = useInfoContext();

    return <>
        <Image src={picture ? picture : undefined} height={80} preview={false}
            onClick={() => ref.current?.click()}
            wrapperStyle={{ marginRight: 8, display: picture ? "initial" : "none", cursor: "pointer" }} />
        <Button icon={<UploadOutlined />} type={enter ? "primary" : "default"}
            onMouseEnter={() => setEnter(true)} onMouseLeave={() => setEnter(false)}
            onClick={() => ref.current?.click()} {...prop}
            style={{ display: picture ? "none" : "initial", cursor: "pointer" }}
        />
        <input type="file" style={{ display: "none" }} ref={ref}
            onChange={() => {
                let files = ref.current?.files;
                if (files && files[0]) {
                    let reader = new FileReader();
                    reader.onload = () => onUpload(reader.result as string);
                    reader.readAsDataURL(files[0]);
                }
            }} />
    </>
}
interface SettingPanelProp {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
}
const SettingPanel = (prop: SettingPanelProp) => {

    const [pwdModal, contextHolder] = Modal.useModal();
    const pwdRef = useRef<InputRef>(null);
    const getInfo = useAPI(APIs.getInfo);
    const updateInfo = useAPI(APIs.updateInfo);
    const [{ username }] = useCookies(["username"]);
    const { themes } = useInfoContext();
    const { updatePicture, updateThemes, updateThemeUsage } = useInfoAction();
    const settingRef = useRef<{ theme: number, picture: string }>({
        theme: -1,
        picture: "",
    });

    const handleOk = useCallback(async () => {
        let { theme, picture } = settingRef.current;

        updateInfo({
            username: username,
            image: picture,
            data: {
                // theme: {
                //     data: {
                //         oldName: themes.find(theme => theme.data.isUsing)!.name,
                //         newName: themes[theme].name
                //     }
                // }
            }
        })[0]
            .then(res => {
                if (res.status !== 200) return;
                // updateThemeUsage(theme);
                updatePicture(picture);
                settingRef.current = {
                    theme: -1,
                    picture: ""
                }
            })
            .catch((e) => {
                console.log(e);
            });

        prop.onOk();
    }, [prop, updateInfo, updatePicture, username]);

    const handleChangePassword = useCallback(async () => {
        const confirmed = await pwdModal.confirm({
            title: "修改密碼",
            content: <Input ref={pwdRef} />,
            okText: "修改",
            cancelText: "取消",
        })

    }, [pwdModal]);

    const options: SelectProps["options"] = themes?.map((item, index) => ({
        value: index,
        label: `${item.name}`,
        item: item.data,
    }));

    return <Modal open={prop.open} onCancel={prop.onCancel} centered title="設定"
        footer={<>
            <Button danger type="primary" onClick={handleChangePassword}>修改密碼</Button>
            {contextHolder}
            <Button onClick={prop.onCancel}>取消</Button>
            <Button type="primary" onClick={handleOk}>儲存</Button>
        </>} styles={{ body: { display: "flex", justifyContent: "center" } }}>

        <div style={{ width: 300 }}>
            <Flex style={{ marginBottom: 8 }} align="center">
                <Upload onUpload={(src) => { settingRef.current.picture = src }} />
                <Typography.Title level={3} style={{ flex: 1, textAlign: "center" }}>{username}</Typography.Title>
            </Flex>

            <Flex align="center" style={{ marginBottom: 8 }}>
                <Typography.Text style={{ marginRight: 8 }}>主題</Typography.Text>
                <Select className={styles.select}
                    options={options}
                    defaultValue={options?.find(opt => opt.item.isUsing)?.value}
                    optionRender={(prop) => {
                        return <Flex justify="space-between" key={prop.key}>
                            <Typography.Text>{prop.label}</Typography.Text>
                            <Flex justify="space-evenly">
                                {
                                    Object.keys(prop.data.item).map((key, index) => {
                                        return <div
                                            key={index}
                                            className={styles.color}
                                            style={{ backgroundColor: prop.data.item[key] }}
                                        ></div>
                                    })
                                }
                            </Flex>
                        </Flex>
                    }}
                    onChange={(val) => {
                        if (!options) return;
                        settingRef.current.theme = val as number;
                    }} />
            </Flex>

            <Flex>
                <Typography.Text style={{ marginRight: 8 }}>語言</Typography.Text>
                <Select className={styles.select}
                    options={[
                        { value: "luck", label: "luck", }
                    ]} />
            </Flex>
        </div>

    </Modal>
}
export default SettingPanel;