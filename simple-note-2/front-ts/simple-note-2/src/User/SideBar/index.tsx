import React from "react";
import {
    Flex,
    Avatar,
    Typography,
    theme,
    Dropdown,
} from "antd";
import { UserOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import {BsBoxArrowRight} from "react-icons/bs";
import FileTree from "./FileTree";
import ThemeMenu from "./ThemeMenu";
import { determineWhiteOrBlack } from "../../util/color";

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

    const handleClick = ({ key }: {key: string}) => {
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


const SideBar = ({ onLogout }: {onLogout?: () => void;}) => {

    const { token } = theme.useToken();

    return <Flex
        vertical
        justify="space-between"
        style={{
            height: "100%",
            overflow: "auto",
            backgroundColor: token.colorPrimary,
        }}>
        <Flex vertical>
            <UserProfile username="username" onLogout={onLogout} />
            <FileTree />
        </Flex>
        <ThemeMenu style={{
            borderRadius: token.Menu ? token.Menu.itemBorderRadius : 8,
        }} />
    </Flex>
}

export default SideBar;