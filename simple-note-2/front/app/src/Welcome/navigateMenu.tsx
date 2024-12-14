import { Button, ConfigProvider, Drawer, Dropdown, Flex, Grid, Menu, MenuProps, theme } from "antd";
import styles from "./navigateMenu.module.css";
import { Link, useLocation } from "react-router-dom";
import { FormOutlined, GithubOutlined } from "@ant-design/icons";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import classNames from "../util/classNames";
import { PersonSquare, PersonFill, HouseDoorFill, PeopleFill, PersonCircle, List } from "react-bootstrap-icons";
import { ItemType } from "antd/es/menu/interface";

const Navigate = (props: React.PropsWithChildren) => {
    return <ul className={styles.navMenu} tabIndex={0} role="menu">{props.children}</ul>;
}

interface NavigateItemProps extends React.PropsWithChildren {
    active?: boolean;
}

const NavigateItem = (props: NavigateItemProps) => {
    const { token } = theme.useToken();
    const ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const { current } = ref;
        current?.style.setProperty("--navItem-underline-background-color", token.colorPrimary);
    }, [token.colorPrimary]);

    return <li ref={ref} role="menuitem" tabIndex={-1}
        className={classNames(styles.navItem, props.active && styles.navItemSelected)}>
        {props.children}
    </li>
}

type NavigateItemData = {
    key: React.Key;
    label: React.ReactNode;
    active?: boolean;
}

interface NavigateMenuButtonProps {
    items?: MenuProps["items"];
}
const NavigateMenuButton = (props: NavigateMenuButtonProps) => {
    const [open, setOpen] = useState(false);

    return <li>
        <Button type="text" icon={<List size={24} />} onClick={() => setOpen(true)} />
        <Drawer title="導覽" open={open} onClose={() => setOpen(false)}>
            <Menu items={props.items} mode="inline" selectable={false} />
        </Drawer>
    </li>
}

interface ContentProps extends React.RefAttributes<HTMLElement> {
    label: React.ReactNode;
    icon: React.ReactNode;
}
const Content = forwardRef(({ label, icon, ...props }: ContentProps, ref: React.ForwardedRef<HTMLElement>) => {
    const { token } = theme.useToken();

    return <Flex gap={8} ref={ref} align="center" style={{ padding: "0.5em 1em" }} {...props}>
        <span className={styles.navText} style={{ color: token.colorText }}>{icon}</span>
        <span className={styles.navText} style={{ color: token.colorText }}>{label}</span>
    </Flex>
});

const { useBreakpoint } = Grid;

export default function NavigateMenu() {
    const { pathname } = useLocation();
    const { lg } = useBreakpoint();

    const members: MenuProps["items"] = [
        {
            key: "leader", icon: <PersonSquare />,
            label: <Link to="https://www.instagram.com/0z3.1415926/" target="_blank" rel="noopener noreferrer">
                <span>林立山</span>
            </Link>,
        },
        {
            key: "mate1", icon: <PersonFill />,
            label: <Link to="https://www.instagram.com/itsuki_f6/" target="_blank" rel="noopener noreferrer">
                <span>蔡岳哲</span>
            </Link>,
        },
        {
            key: "mate2", icon: <PersonFill />,
            label: <span>李泓逸</span>,
        }
    ];

    const items: NavigateItemData[] = [
        {
            key: "intro", active: pathname === "/",
            label: <Link to="/">
                <Content label="介紹" icon={<HouseDoorFill />} />
            </Link>,
        },
        {
            key: "team",
            label: <Dropdown menu={{ items: members }} trigger={["click", "hover"]} placement="bottom">
                <Content label="團隊" icon={<PeopleFill />} />
            </Dropdown>,
        },
        {
            key: "github",
            label: <Link to="https://github.com/ian5030560/simple-note-2" target="_blank" rel="noreferrer">
                <Content label="GitHub" icon={<GithubOutlined />} />
            </Link>,
        },
        {
            key: "playground",
            label: <Link to="/playground" target="_blank" rel="noreferrer">
                <Content label="Playground" icon={<FormOutlined />} />
            </Link>,
        },
        {
            key: "auth", active: pathname === "/auth",
            label: <Link to="/auth">
                <Content label="登入/註冊" icon={<PersonCircle />} />
            </Link>,
        }
    ]

    const buttonItems: ItemType[] = [
        {
            key: "intro", icon: <HouseDoorFill />,
            label: <Link to="/"><span>介紹</span></Link>
        },
        {
            key: "team", label: "團隊", icon: <PeopleFill />,
            children: members
        },
        {
            key: "github", icon: <GithubOutlined />,
            label: <Link to="https://github.com/ian5030560/simple-note-2" target="_blank" rel="noreferrer">
                <span>GitHub</span>
            </Link>
        },
        {
            key: "playground", icon: <FormOutlined />, 
            label: <Link to="/playground" target="_blank" rel="noreferrer">
                <span>Playground</span>
            </Link>
        },
        {
            key: "auth", icon: <PersonCircle />, 
            label: <Link to="/auth">
                登入/註冊
            </Link>
        },
    ]

    return <ConfigProvider theme={{
        token: { fontSizeIcon: 18, fontSize: 18 },
        components: { Dropdown: { paddingBlock: "0.5em" } }
    }}>
        <Navigate>
            {
                lg && items.map(it => <NavigateItem key={it.key} active={it.active}>
                    {it.label}
                </NavigateItem>)
            }
            {!lg && <NavigateMenuButton items={buttonItems} />}
        </Navigate>
    </ConfigProvider>
}