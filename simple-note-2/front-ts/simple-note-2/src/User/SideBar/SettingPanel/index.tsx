import { Modal, Flex, Image, Input, Button, Select, Typography, InputRef, SelectProps } from "antd"
import { useCallback, useEffect, useRef } from "react";
import styles from "./index.module.css";
import useAPI, { APIs } from "../../../util/api";
import { Info, useInfo } from "../info";
import { defaultSeed, testSeed, useThemeSeed } from "../../../theme";
import { useCookies } from "react-cookie";

interface SettingPanelProp {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
}
const SettingPanel = (prop: SettingPanelProp) => {

    const [info, setInfo] = useInfo();
    const [pwdModal, contextHolder] = Modal.useModal();
    const pwdRef = useRef<InputRef>(null);
    const getInfo = useAPI(APIs.getInfo);
    const updateInfo = useAPI(APIs.updateInfo);
    const [, setSeed] = useThemeSeed();
    const [{username}] = useCookies(["username"]);
    const settingRef = useRef({
        theme: info?.themes.find(value => value.isUsing),
        picture: info?.picture
    });

    // useEffect(() => {
    //     getInfo({ username: username})
    //     .then((res) => res.json())
    //     .then((res) => {
    //         setInfo({
    //             username: username,
    //             picture: res.image,
    //             themes: res.themes,
    //         })
    //     })
    //     .catch(() => {});
    // }, [getInfo, setInfo, username]);

    const handleOk = useCallback(() => {
        prop.onOk();
    }, [prop]);

    const handleChangePassword = useCallback(async () => {
        const confirmed = await pwdModal.confirm({
            title: "修改密碼",
            content: <Input ref={pwdRef} />,
            okText: "修改",
            cancelText: "取消",
        })

    }, [pwdModal]);

    const options: SelectProps["options"] = info?.themes.map((item, index) => ({
        value: `theme-${index}`,
        label: `theme-${index}`,
        item: item,
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
                <Image width={50} height={50} src={info?.picture} wrapperStyle={{ marginRight: 8 }} />
                <Typography.Title level={3} style={{ flex: 1, textAlign: "center" }}>{info?.username || "username"}</Typography.Title>
            </Flex>

            <Flex align="center" style={{ marginBottom: 8 }}>
                <Typography.Text style={{ marginRight: 8 }}>主題</Typography.Text>
                <Select className={styles.select}
                    options={options}
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
                        if(!options) return;
                        for(let option of options){
                            option.item.isUsing = false;
                            if(option.value !== val) continue;
                            option.item.isUsing = true;
                            let pic = settingRef.current.picture;
                            settingRef.current = {
                                theme: option.item,
                                picture: pic,
                            }
                            console.log(settingRef.current);
                        }
                    }}/>
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