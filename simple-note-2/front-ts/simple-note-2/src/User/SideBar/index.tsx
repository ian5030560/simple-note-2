import React, { useCallback, useEffect, useState } from "react";
import { Flex, Avatar, Typography, theme, Dropdown, notification, Modal, FlexProps } from "antd";
import { UserOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { BsBoxArrowRight } from "react-icons/bs";
import FileTree from "./FileTree";
import { useCookies } from "react-cookie";
import SettingPanel from "./SettingPanel";
import { useNavigate } from "react-router-dom";
import useAPI, { APIs } from "../../util/api";
import { useInfoContext } from "./info";

const { Title } = Typography;

const UserProfile = ({ style }: { style?: React.CSSProperties }) => {
    const { token } = theme.useToken();
    const [signOutOpen, setSignOutOpen] = useState(false);
    const [settingOpen, setSettingOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [{ username }, , removeCookies] = useCookies(["username"]);
    const navigate = useNavigate();
    const signOut = useAPI(APIs.signOut);
    const { picture } = useInfoContext();

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
                setSignOutOpen(true);
                break;
            default:
                break;
        }
    }

    const handleSignOutOk = useCallback(() => {
        setSignOutOpen(false);

        signOut(username)
            .then((value) => {
                if (!value) {
                    api.error(
                        {
                            message: "登出發生錯誤，請重新登出",
                            placement: "top",
                        }
                    )
                }
                else {
                    removeCookies("username");
                    navigate("/");
                }
            })
    }, [api, navigate, removeCookies, signOut, username]);

    return <Flex align="baseline" gap="small" style={style}>
        <Avatar
            size={"large"}
            shape="square"
            icon={<UserOutlined />}
            src={picture}
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
            open={signOutOpen} centered title="登出" okText="是" cancelText="否"
            okButtonProps={{ danger: true, }}
            cancelButtonProps={{ type: "default" }}
            onOk={handleSignOutOk}
            onCancel={() => setSignOutOpen(false)}
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

    return <Flex vertical className={className}
        style={{ backgroundColor: token.colorPrimary, ...style }}
        {...prop}>
        <UserProfile style={{ marginBottom: 12 }} />
        <FileTree />
    </Flex>
}

export default SideBar;