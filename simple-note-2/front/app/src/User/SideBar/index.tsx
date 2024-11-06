import React, { useCallback, useMemo, useState } from "react";
import { Flex, Avatar, Typography, theme, Dropdown, notification, Modal } from "antd";
import { UserOutlined, EllipsisOutlined, SettingOutlined, TeamOutlined } from "@ant-design/icons";
import { BsBoxArrowRight } from "react-icons/bs";
import NoteTree from "./NoteTree";
import { useCookies } from "react-cookie";
import SettingModal from "./setting";
import { useNavigate } from "react-router-dom";
import useAPI from "../../util/api";
import useInfo from "./info";
import CollaborateModal from "./collaborate";
import { ItemType } from "antd/es/menu/interface";

const UserProfile = () => {
    const { token } = theme.useToken();
    const [state, setState] = useState({
        setting: { open: false, label: "設定", icon: <SettingOutlined /> },
        signOut: { open: false, label: "登出", icon: <BsBoxArrowRight /> },
        collab: { open: false, label: "協作", icon: <TeamOutlined /> },
    });

    const updateModal = useCallback((key: keyof typeof state, value: boolean) => setState(prev => {
        prev[key].open = value;
        return { ...prev };
    }), []);

    const [api, contextHolder] = notification.useNotification();
    const [{ username }, , removeCookies] = useCookies(["username"]);
    const navigate = useNavigate();
    const signOut = useAPI(APIs.signOut);
    const { picture } = useInfo();

    const items = useMemo(() => {
        const arr: ItemType[] = [];
        for (let key in state) {
            const rest = state[key];

            arr.push({ key, ...rest });
        }
        return arr;
    }, [state]);

    const handleClick = ({ key }: { key: string }) => {
        updateModal(key as keyof typeof state, true);
    }

    const handleSignOutOk = useCallback(() => {
        updateModal("signOut", false);

        signOut({ username: username })[0]
            .then((value) => {
                if (!value) {
                    api.error({ message: "登出發生錯誤，請重新登出", placement: "top" })
                }
                else {
                    removeCookies("username");
                    navigate("/");
                }
            })
    }, [api, navigate, removeCookies, signOut, updateModal, username]);


    return <Flex justify="center" align="center" gap={"middle"}>
        <Avatar size={"large"} shape="square" icon={<UserOutlined />} src={picture} />
        <h1 style={{ color: token.colorText, textOverflow: "ellipsis", fontWeight: "normal" }}>
            {username}
        </h1>
        <Dropdown menu={{ items, onClick: handleClick }} trigger={["click"]} placement="bottom">
            <EllipsisOutlined style={{ color: token.colorText }} />
        </Dropdown>
        <Modal
            open={state.signOut.open} centered title="登出" okText="是" cancelText="否"
            okButtonProps={{ danger: true, }} cancelButtonProps={{ type: "default" }}
            onOk={handleSignOutOk} onCancel={() => updateModal("signOut", false)}
        >
            <Text>是否確定登出</Text>
        </Modal>
        <SettingModal open={state.setting.open} onOk={() => updateModal("setting", false)}
            onCancel={() => updateModal("setting", false)} />
        <CollaborateModal open={state.collab.open} onCancel={() => updateModal("collab", false)} username={username}/>
        {contextHolder}
    </Flex>
}


const { Text } = Typography;

const SideBar = () => {
    const [{ username }] = useCookies(["username"]);

    return <Flex vertical style={{ height: "100%", padding: "24px 12px" }}>
        <UserProfile />
        <NoteTree username={username}/>
    </Flex>
}

export default SideBar;