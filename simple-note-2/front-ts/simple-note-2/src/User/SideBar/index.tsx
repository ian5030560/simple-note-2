import React, { useCallback, useEffect, useState } from "react";
import { Flex, Avatar, Typography, theme, Dropdown, notification, Modal, FlexProps } from "antd";
import { UserOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { BsBoxArrowRight } from "react-icons/bs";
import FileTree from "./FileTree";
import { useCookies } from "react-cookie";
import User from "../../service/user";
import SettingPanel from "./SettingPanel";

const { Title } = Typography;

interface UserProfileProp {
    username?: string;
    src?: string;
    onLogout?: () => void;
    onSet?: () => void;
}

const UserProfile: React.FC<UserProfileProp> = ({ username, src }) => {

    const { token } = theme.useToken();
    const [logOutOpen, setLogOutOpen] = useState(false);
    const [settingOpen, setSettingOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();

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
                setSettingOpen(true)
                break;
            case "log out":
                setLogOutOpen(true);
                break;
            default:
                break;
        }
    }

    const handleLogoutOk = useCallback(() => {
        setLogOutOpen(false);

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
        <Title level={4} ellipsis>{username}</Title>
        <Dropdown
            menu={{ items, onClick: handleClick }}
            trigger={["click"]}
            placement="bottom"
        >
            <EllipsisOutlined style={{ color: token.colorText }} />
        </Dropdown>
        <Modal
            open={logOutOpen} centered title="登出" okText="是" cancelText="否"
            okButtonProps={{ danger: true, }}
            cancelButtonProps={{ type: "default" }}
            onOk={handleLogoutOk}
            onCancel={() => setLogOutOpen(false)}
        >
            <Text>是否確定登出</Text>
        </Modal>
        {contextHolder}
        <SettingPanel open={settingOpen} onOk={() => setSettingOpen(false)} onCancel={() => setSettingOpen(false)} />
    </Flex>
}


const { Text } = Typography;

export interface SideBarProps extends Omit<FlexProps, "vertical" | "children"> {
    className: string | undefined,
    style?: React.CSSProperties,
}
const SideBar = ({ className, style, ...prop }: SideBarProps) => {

    const { token } = theme.useToken();
    const [{ username }] = useCookies(["username"]);

    return <Flex vertical className={className}
        style={{ backgroundColor: token.colorPrimary, ...style }}
        {...prop}>
        <Flex vertical>
            <UserProfile username="username" />
            <FileTree />
        </Flex>
    </Flex>

}

export default SideBar;