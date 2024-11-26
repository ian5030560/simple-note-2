import { Modal, Flex, Image, Button, Select, Typography, SelectProps, Empty, Skeleton, Spin, notification, Divider } from "antd"
import { useCallback, useRef, useState } from "react";
import styles from "./setting.module.css";
import useAPI from "../../util/api";
import useUser, { DEFAULT_THEME_ID } from "../../util/useUser";
import { BoxArrowInRight, Upload as BsUpload, PlusLg, XLg } from "react-bootstrap-icons";
import { SyncOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ChangePasswordModal, { ChangePasswordData } from "./changePassword";
import SignOutModal from "./signOut";

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

interface SettingItemProps extends React.PropsWithChildren {
    title: string;
    description: string;
}
const SettingItem = (props: SettingItemProps) => {
    return <Flex vertical>
        <Divider orientation="left">
            <Typography.Text strong>{props.title}</Typography.Text>
        </Divider>
        <Flex align="center" justify="space-between">
            <Typography.Text type="secondary">{props.description}</Typography.Text>
            {props.children}
        </Flex>
    </Flex>
}

interface SettingModalProp {
    open: boolean;
    onClose: () => void;
}
const SettingModal = (prop: SettingModalProp) => {
    const { info, theme } = useAPI();
    const { username, themes, applyTheme, deleteTheme, password } = useUser();
    const [loading, setLoading] = useState(false);
    const [notifyAPI, notifyContextHolder] = notification.useNotification({ placement: "top" });
    const [changePassword, setChangePassword] = useState(false);
    const [signOut, setSignOut] = useState(false);

    const handleDelete = useCallback((value: string, name: string) => {
        if (!username) return;

        theme.delete(username, value).then(ok => {
            if (!ok) throw new Error();
            notifyAPI.success({ message: "刪除成功", description: `主題 ${name} 刪除成功` });
            deleteTheme(value);
        }).catch(() => {
            notifyAPI.error({ message: "刪除失敗", description: `主題 ${name} 刪除失敗` });
        });
    }, [deleteTheme, notifyAPI, theme, username]);

    const optionRender: SelectProps["optionRender"] = (props) => {

        const { label, value, ...rest } = props.data;
        return <Flex justify="space-between" align="center" flex={1} key={props.key}>
            <Flex gap={8} flex={1} style={{ flexGrow: 1 }}>
                <Typography.Text ellipsis style={{ flex: 1 }}>{props.label}</Typography.Text>
                <Flex style={{ flex: 1 }} gap={4}>
                    {
                        Object.keys(rest).map((key, index) => <div key={props.data[key] + index} className={styles.color}
                            style={{ backgroundColor: props.data[key] }} />)
                    }
                </Flex>
            </Flex>
            {
                value !== DEFAULT_THEME_ID && <Button type="text" icon={<XLg />} onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(value as string, label as string)
                }} />
            }
        </Flex>
    };

    const handleChangeTheme = useCallback((value: string) => {
        if (!username) return;
        setLoading(true);

        info.update(username!, { themeId: value }).then(ok => {
            if (!ok) throw new Error();
            notifyAPI.success({ message: "更新成功", description: "主題更新成功" });
            applyTheme(value);
        }).catch(() => notifyAPI.error({
            message: "更新失敗",
            description: "主題更新失敗"
        })).finally(() => setLoading(false));

    }, [applyTheme, info, notifyAPI, username]);

    const handleChangePassword = useCallback((values: ChangePasswordData) => {
        if (!username) return;

        setLoading(true);
        info.update(username, { password: values.new }).then(ok => {
            if (!ok) throw new Error();
            password.content = values.new;
            notifyAPI.success({
                message: "更換成功",
                description: "密碼更換成功"
            })
        }).catch(() => notifyAPI.error({
            message: "更換失敗",
            description: "密碼更換失敗"
        })).finally(() => {
            setChangePassword(false);
            setLoading(false);
        });
    }, [info, notifyAPI, password, username]);

    const options: SelectProps["options"] = themes.map(theme => ({
        label: theme.name, value: theme.id, ...theme.data
    }));

    return <Modal open={prop.open} onCancel={prop.onClose} centered title="設定" footer={null}>
        <Flex vertical gap={10}>
            <Flex align="center" gap={16}>
                <Upload onUpload={() => { }} />
                <Flex vertical gap={8}>
                    <Typography.Text strong>使用者名稱</Typography.Text>
                    <Typography.Text>{username}</Typography.Text>
                </Flex>
            </Flex>

            <Flex vertical gap={8}>
                <SettingItem title="主題" description="選擇並變更你的主題">
                    <Select options={options} variant="filled" value={themes.find(it => it.using)?.id}
                        optionRender={optionRender} onChange={handleChangeTheme}
                        dropdownStyle={{ width: "fit-content" }} dropdownAlign={{ offset: ["-25%", 0] }}
                        dropdownRender={(menu) => <>
                            {menu}
                            <Link to={"/theme"}>
                                <Button type="dashed" icon={<PlusLg size={24} />} block style={{ marginTop: 12 }} />
                            </Link>
                        </>} />
                </SettingItem>
                <SettingItem title="帳號" description="登出你的帳戶">
                    <Button type="default" icon={<BoxArrowInRight/>} onClick={() => setSignOut(true)}>登出</Button>
                    <SignOutModal open={signOut} onClose={() => setSignOut(false)} />
                </SettingItem>
                <SettingItem title="密碼" description="更換你的密碼確保帳號安全性">
                    <Button danger type="link" icon={<SyncOutlined />} onClick={() => setChangePassword(true)}>更換</Button>
                    <ChangePasswordModal open={changePassword} onOk={handleChangePassword} onClose={() => setChangePassword(false)} />
                </SettingItem>
            </Flex>
        </Flex>
        <Spin fullscreen tip="更新中" size="large" spinning={loading} />
        {notifyContextHolder}
    </Modal>
}
export default SettingModal;