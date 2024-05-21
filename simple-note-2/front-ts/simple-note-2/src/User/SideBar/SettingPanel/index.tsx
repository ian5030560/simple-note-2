import { Modal, Flex, Image, Input, Button, Select, Typography, InputRef, SelectProps } from "antd"
import { useCallback, useEffect, useRef } from "react";
import styles from "./index.module.css";
import useAPI, { APIs } from "../../../util/api";
import { useInfoAction, useInfoContext } from "../info";
import { useCookies } from "react-cookie";
import { defaultSeed, testSeed } from "../../../theme";

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
    const { picture, themes } = useInfoContext();
    const { updatePicture, updateThemes, updateThemeUsage } = useInfoAction();

    const settingRef = useRef({
        theme: 0,
        picture: picture
    });

    useEffect(() => {
        updateThemes(
            [
                {
                    name: "預設",
                    data: {
                        isUsing: true,
                        ...defaultSeed,
                    },
                },
                {
                    name: "測試",
                    data: {
                        isUsing: false,
                        ...testSeed,
                    }
                }
            ]
        )
    }, [updateThemes]);

    // useEffect(() => {
    //     getInfo({ username: username})
    //     .then((res) => res.json())
    //     .then((res) => {
    //         updatePicture(res.picture);
    //         updateThemes(res.themes);    
    //     })
    //     .catch(() => {});
    // }, [getInfo, updatePicture, updateThemes, username]);

    const handleOk = useCallback(() => {
        let { theme, picture } = settingRef.current;
        updateThemeUsage(theme);
        updatePicture(picture);
        prop.onOk();
    }, [prop, updatePicture, updateThemeUsage]);

    const handleChangePassword = useCallback(async () => {
        const confirmed = await pwdModal.confirm({
            title: "修改密碼",
            content: <Input ref={pwdRef} />,
            okText: "修改",
            cancelText: "取消",
        })

    }, [pwdModal]);

    const options: SelectProps["options"] = themes.map((item, index) => ({
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
                <Image width={50} height={50} src={picture} wrapperStyle={{ marginRight: 8 }} />
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
                    onChange={(val, option) => {
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