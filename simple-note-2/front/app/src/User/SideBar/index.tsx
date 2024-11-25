import { useCallback, useMemo, useState } from "react";
import { Flex, Avatar, theme, Dropdown } from "antd";
import { UserOutlined, EllipsisOutlined, SettingOutlined, TeamOutlined } from "@ant-design/icons";
import NoteTree from "./NoteTree";
import SettingModal from "./setting";
import CollaborateModal from "./collaborate";
import { ItemType } from "antd/es/menu/interface";
import useUser from "../../util/useUser";

const UserProfile = () => {
    const { token } = theme.useToken();
    const [state, setState] = useState({
        setting: { open: false, label: "設定", icon: <SettingOutlined /> },
        collab: { open: false, label: "協作", icon: <TeamOutlined /> },
    });

    const updateModal = useCallback((key: keyof typeof state, value: boolean) => setState(prev => {
        prev[key].open = value;
        return { ...prev };
    }), []);

    const { username, picture } = useUser();

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

    return <Flex justify="center" align="center" gap={"middle"}>
        <Avatar size={"large"} shape="square" icon={<UserOutlined />} src={picture} />
        <h1 style={{ color: token.colorText, textOverflow: "ellipsis", fontWeight: "normal" }}>
            {username}
        </h1>
        <Dropdown menu={{ items, onClick: handleClick }} trigger={["click"]} placement="bottom">
            <EllipsisOutlined style={{ color: token.colorText }} />
        </Dropdown>
        <SettingModal open={state.setting.open} onClose={() => updateModal("setting", false)} />
        <CollaborateModal open={state.collab.open} onClose={() => updateModal("collab", false)} />
    </Flex>
}

const SideBar = () => {
    return <Flex vertical style={{ height: "100%", padding: "24px 12px" }}>
        <UserProfile />
        <NoteTree />
    </Flex>
}

export default SideBar;