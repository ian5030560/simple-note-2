import { Dropdown, Flex, Grid, MenuProps, theme } from "antd";
import styles from "./navigateMenu.module.css";
import { Link, useLocation } from "react-router-dom";
import { FormOutlined, GithubOutlined } from "@ant-design/icons";
import React, { forwardRef, useEffect, useRef } from "react";
import classNames from "../util/classNames";
import { PersonSquare, PersonFill, HouseDoorFill, PeopleFill, PersonCircle, List } from "react-bootstrap-icons";

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
        className={classNames(styles.navItem, props.active ? styles.navItemSelected : "")}>
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
    const { token } = theme.useToken();

    return <li>
        <Dropdown menu={{ items: props.items }} trigger={["click"]} placement="bottomLeft">
            <button type="button" style={{ color: token.colorText }} className={styles.navMenuButton}>
                <List size={24} />
            </button>
        </Dropdown>
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
const dropDownItemStyle: React.CSSProperties = {
    fontSize: 18, padding: "0.5em 1em"
}
const iconSize = 16;
export default function NavigateMenu() {
    const { pathname } = useLocation();
    const { xl, lg, md } = useBreakpoint();

    const members: MenuProps["items"] = [
        {
            key: "leader", icon: <PersonSquare size={iconSize} />,
            label: <Link to="https://www.instagram.com/0z3.1415926/" target="_blank" rel="noopener noreferrer">
                <span>林立山</span>
            </Link>,
            style: dropDownItemStyle,
        },
        {
            key: "mate1", icon: <PersonFill size={iconSize} />,
            label: <Link to="https://www.instagram.com/itsuki_f6/" target="_blank" rel="noopener noreferrer">
                <span>蔡岳哲</span>
            </Link>,
            style: dropDownItemStyle,
        },
        {
            key: "mate2", icon: <PersonFill size={iconSize} />,
            label: <span>李泓逸</span>,
            style: dropDownItemStyle,
        }
    ];

    const items: (NavigateItemData & { hidden?: boolean })[] = [
        {
            key: "intro", active: pathname === "/",
            label: <Link to="/">
                <Content label="介紹" icon={<HouseDoorFill />} />
            </Link>,
            hidden: !md,
        },
        {
            key: "team",
            label: <Dropdown menu={{ items: members }} trigger={["click", "hover"]} placement="bottom">
                <Content label="團隊" icon={<PeopleFill />} />
            </Dropdown>,
            hidden: !md,
        },
        {
            key: "github",
            label: <Link to="https://github.com/ian5030560/simple-note-2" target="_blank" rel="noreferrer">
                <Content label="GitHub" icon={<GithubOutlined />} />
            </Link>,
            hidden: !md,
        },
        {
            key: "playground",
            label: <Link to="/playground" target="_blank" rel="noreferrer">
                <Content label="Playground" icon={<FormOutlined />} />
            </Link>,
            hidden: !lg,
        },
        {
            key: "auth", active: pathname === "/auth",
            label: <Link to="/auth">
                <Content label="登入/註冊" icon={<PersonCircle />} />
            </Link>,
            hidden: !xl,
        }
    ]

    return <Navigate>
        {
            items.filter(it => it.hidden === false)
                .map(it => <NavigateItem key={it.key} active={it.active}>
                    {it.label}
                </NavigateItem>)
        }
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        {!xl && <NavigateMenuButton items={items.map(({ active, ...rest }) => rest).filter(it => it.hidden)} />}
    </Navigate>
}