import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Flex, Avatar, Typography, theme, Dropdown, notification, Modal, FlexProps } from "antd";
import { UserOutlined, EllipsisOutlined, SettingOutlined, TeamOutlined } from "@ant-design/icons";
import { BsBoxArrowRight } from "react-icons/bs";
import FileTree from "./FileTree";
import { useCookies } from "react-cookie";
import SettingModal from "./Setting";
import { useNavigate } from "react-router-dom";
import useAPI, { APIs } from "../../util/api";
import { useInfoContext } from "./info";
import CollaborateModal from "./Collaborate";


const UserProfile = () => {
    const { token } = theme.useToken();
    const [signOutOpen, setSignOutOpen] = useState(false);
    const [settingOpen, setSettingOpen] = useState(false);
    const [collaborateOpen, setCollaborateOpen] = useState(false);
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
        },
        {
            key: "collaborate",
            label: "發起協作",
            icon: <TeamOutlined />
        }
    ];

    const handleClick = ({ key }: { key: string }) => {
        const open: {[key: string]: (value: boolean) => void} = {
            "setting": setSettingOpen,
            "log out": setSignOutOpen,
            "collaborate": setCollaborateOpen
        }

        open[key]?.(true);
    }

    const handleSignOutOk = useCallback(() => {
        setSignOutOpen(false);

        signOut({username: username})[0]
            .then((value) => {
                if (!value) {
                    api.error({message: "登出發生錯誤，請重新登出", placement: "top"})
                }
                else {
                    removeCookies("username");
                    navigate("/");
                }
            })
    }, [api, navigate, removeCookies, signOut, username]);


    return <Flex justify="center" align="center" gap={"middle"}>
        <Avatar size={"large"} shape="square" icon={<UserOutlined />} src={picture}/>
        <h1 style={{color: token.colorText, textOverflow: "ellipsis", fontWeight: "normal"}}>
            {username}
        </h1>
        <Dropdown menu={{ items, onClick: handleClick }} trigger={["click"]} placement="bottom">
            <EllipsisOutlined style={{ color: token.colorText }} />
        </Dropdown>
        <Modal
            open={signOutOpen} centered title="登出" okText="是" cancelText="否"
            okButtonProps={{ danger: true, }} cancelButtonProps={{ type: "default" }}
            onOk={handleSignOutOk} onCancel={() => setSignOutOpen(false)}
        >
            <Text>是否確定登出</Text>
        </Modal>
        {contextHolder}
        <SettingModal open={settingOpen} onOk={() => setSettingOpen(false)} onCancel={() => setSettingOpen(false)} />
        <CollaborateModal open={collaborateOpen} onCancel={() => setCollaborateOpen(false)}/>
    </Flex>
}


const { Text } = Typography;

export interface SideBarProps extends Omit<FlexProps, "vertical" | "children"> {
    className: string | undefined,
}
const SideBar = ({ className, ...prop }: SideBarProps) => {

    return <Flex vertical className={className}style={{ height: "100%" }} {...prop}>
        <UserProfile />
        <FileTree />
    </Flex>
}

export default SideBar;