import { Modal, Flex, Image, Button, Select, Typography, SelectProps, Empty, Skeleton, Spin, notification, Divider } from "antd"
import { useCallback, useRef, useState } from "react";
import styles from "./setting.module.css";
import useAPI from "../../util/api";
import useUser, { DEFAULT_THEME_ID } from "../../util/useUser";
import { CloseOutlined, PlusOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ChangePasswordModal, { ChangePasswordData } from "./changePassword";
import SignOutModal from "./signOut";
import { BoxArrowInRight } from "react-bootstrap-icons";

interface UploadProps { onUpload: (src: string) => void };
const Upload = ({ onUpload }: UploadProps) => {
    const ref = useRef<HTMLInputElement>(null);
    const { picture } = useUser();

    const handleChange = useCallback(() => {
        const files = ref.current?.files;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onload = () => onUpload(reader.result as string);
            reader.readAsDataURL(files[0]);
        }
    }, [onUpload]);

    return <>
        {
            picture ? <Flex vertical gap={3}>
                <Image src={picture} placeholder={<Skeleton.Image />} alt="載入圖片錯誤" style={{ maxWidth: 100, maxHeight: 100 }} />
                <Button type="dashed" icon={<SyncOutlined />} block onClick={() => ref.current?.click()}>更換</Button>
            </Flex> : <Empty imageStyle={{ width: 100, height: 100 }} description={<Button icon={<UploadOutlined />}
                block type="dashed" onClick={() => ref.current?.click()}>上傳</Button>} />
        }
        <input aria-label="file" type="file" accept="image/*" style={{ display: "none" }} ref={ref} onChange={handleChange} />
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
    const { username, themes, applyTheme, deleteTheme, password, changePicture } = useUser();
    const [loading, setLoading] = useState(false);
    const [notifyAPI, notifyContextHolder] = notification.useNotification({ placement: "topRight" });
    const [changePassword, setChangePassword] = useState(false);
    const [signOut, setSignOut] = useState(false);

    const handleDelete = useCallback((value: string, name: string) => {
        if (!username) return;

        const [, id] = value.split("-");
        theme.delete(username, id).then(ok => {
            if (!ok) throw new Error();
            notifyAPI.success({ message: "刪除成功", description: `主題 ${name} 刪除成功` });
            deleteTheme(id);
        }).catch(() => {
            notifyAPI.error({ message: "刪除失敗", description: `主題 ${name} 刪除失敗` });
        });
    }, [deleteTheme, notifyAPI, theme, username]);

    const optionRender: SelectProps["optionRender"] = (props) => {
        const { label, value, ...rest } = props.data;

        const [, id] = (value as string).split("-");

        return <Flex justify="space-between" align="center" gap={8} key={props.key}>
            <Flex gap={8} style={{ flexGrow: 1 }}>
                <Typography.Text ellipsis>{props.label}</Typography.Text>
                <Flex gap={4}>
                    {
                        Object.keys(rest).map((key, index) => <div key={props.data[key] + index} className={styles.color}
                            style={{ backgroundColor: props.data[key] }} />)
                    }
                </Flex>
            </Flex>
            {
                id !== DEFAULT_THEME_ID && <Button type="text" icon={<CloseOutlined />} onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(value as string, label as string)
                }} />
            }
        </Flex>
    };

    const handleChangeTheme = useCallback((value: string) => {
        if (!username) return;
        setLoading(true);

        const [name, id] = value.split("-");

        const theme = {
            id: id === DEFAULT_THEME_ID ? null : id,
            name: id === DEFAULT_THEME_ID ? null : name,
        }
        console.log(theme);
        info.update(username, { theme }).then(ok => {
            if (!ok) throw new Error();
            notifyAPI.success({ message: "更新成功", description: "主題更新成功" });
            applyTheme(id);
        }).catch((e) => {
            console.log(e);
            notifyAPI.error({
                message: "更新失敗",
                description: "主題更新失敗"
            })
        }).finally(() => setLoading(false));

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
            });
        }).catch(() => notifyAPI.error({
            message: "更換失敗",
            description: "密碼更換失敗"
        })).finally(() => {
            setChangePassword(false);
            setLoading(false);
        });
    }, [info, notifyAPI, password, username]);

    const handleChangePicture = useCallback((src: string) => {
        if (!username) return;

        setLoading(true);
        info.update(username, { image: src }).then(ok => {
            if (!ok) throw new Error();
            changePicture(src);
            notifyAPI.success({
                message: "更換成功",
                description: "照片更換成功"
            });
        }).catch(() => notifyAPI.error({
            message: "更換失敗",
            description: "照片更換失敗"
        })).finally(() => setLoading(false));

    }, [changePicture, info, notifyAPI, username]);

    const dropDownRender: SelectProps["dropdownRender"] = useCallback((menu: React.ReactElement) => <>
        {menu}
        <Link to={"/theme"}>
            <Button type="dashed" icon={<PlusOutlined />} block style={{ marginTop: 12 }} />
        </Link>
    </>, []);

    const options: SelectProps["options"] = themes.map(theme => ({
        label: theme.name, value: `${theme.name}-${theme.id}`, ...theme.data
    }));

    return <Modal open={prop.open} onCancel={prop.onClose} centered title="設定" footer={null}>
        <Flex vertical gap={10}>
            <Flex align="center" gap={16}>
                <Upload onUpload={handleChangePicture} />
                <Flex vertical gap={8}>
                    <Typography.Text strong>使用者名稱</Typography.Text>
                    <Typography.Text>{username}</Typography.Text>
                </Flex>
            </Flex>

            <Flex vertical gap={8}>
                <SettingItem title="主題" description="選擇並變更你的主題">
                    <Select options={options} variant="filled" value={themes.find(it => it.using)?.name}
                        optionRender={optionRender} onChange={handleChangeTheme} dropdownRender={dropDownRender}
                        dropdownStyle={{ width: "fit-content" }} placement="bottomRight" />
                </SettingItem>
                <SettingItem title="帳號" description="登出你的帳戶">
                    <Button type="default" icon={<BoxArrowInRight />} onClick={() => setSignOut(true)}>登出</Button>
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