import React, { useCallback, useState } from "react";
import {
    Flex,
    Avatar,
    Typography,
    theme,
    Dropdown,
    notification,
    Modal,
} from "antd";
import { UserOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { BsBoxArrowRight } from "react-icons/bs";
import FileTree from "./FileTree";
import ThemeMenu from "./ThemeMenu";
import { determineWhiteOrBlack } from "../../util/color";
import { useCookies } from "react-cookie";
import User from "../../service/user";

const { Title } = Typography;

interface UserProfileProp {
    username?: string;
    src?: string;
    onLogout?: () => void;
    onSet?: () => void;
}

const UserProfile: React.FC<UserProfileProp> = ({ username, src, onLogout, onSet }) => {

    const { token } = theme.useToken();

    const items = [
        {
            key: "setting",
            label: "設定",
            icon: <SettingOutlined />
        },
        {
            key: "log out",
            label: "登出",
            icon: <BsBoxArrowRight />
        }
    ];

    const handleClick = ({ key }: { key: string }) => {
        switch (key) {
            case "setting":
                onSet?.();
                break;
            case "log out":
                onLogout?.();
                break;
            default:
                break;
        }
    }

    return <Flex
        align="baseline"
        gap="small"
        style={{ padding: token.padding }}
    >
        <Avatar
            size={"large"}
            shape="square"
            icon={src ? null : <UserOutlined />}
            src={src}
        />
        <Title level={4} ellipsis style={{ color: determineWhiteOrBlack(token.colorPrimary) }}>{username}</Title>
        <Dropdown
            menu={{
                items,
                onClick: handleClick
            }}
            trigger={["click"]}
            placement="bottom"
        >
            <EllipsisOutlined style={{ color: determineWhiteOrBlack(token.colorPrimary) }} />
        </Dropdown>
    </Flex>
}


const {Text} = Typography;
const SideBar = () => {

    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    // const [{ username }] = useCookies(["username"]);

    const handleLogoutOk = useCallback(() => {
        setOpen(false);
        
        // User.userLogOut(username)
        //     .then((value) => {
        //         if (!value) {
        //             api.error(
        //                 {
        //                     message: "登出發生錯誤，請重新登出",
        //                     placement: "top",
        //                 }
        //             )
        //         }
        //     })
    }, []);

    return <>
        <Flex
            vertical
            justify="space-between"
            style={{
                height: "100%",
                overflow: "auto",
                backgroundColor: token.colorPrimary,
            }}>
            <Flex vertical>
                <UserProfile username="username" onLogout={() => setOpen(true)} />
                <FileTree />
            </Flex>
            <ThemeMenu />
        </Flex>
        
        <Modal
            open={open} centered title="登出" okText="是" cancelText="否"
            okButtonProps={{danger: true,}}
            cancelButtonProps={{type: "default",}}
            onOk={handleLogoutOk}
            onCancel={() => setOpen(false)}
        >
            <Text>是否確定登出</Text>
        </Modal>
        {contextHolder}
    </>
}

export default SideBar;