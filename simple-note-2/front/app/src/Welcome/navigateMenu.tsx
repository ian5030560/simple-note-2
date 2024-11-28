import { Button, Dropdown, Flex, Grid, MenuProps, theme } from "antd";
import styles from "./navigateMenu.module.css";
import { Link, useLocation } from "react-router-dom";
import { HouseDoorFill, List, PeopleFill, PersonCircle, PersonFill, PersonSquare } from "react-bootstrap-icons";
import { FormOutlined, GithubOutlined } from "@ant-design/icons";
import React, { forwardRef, useEffect, useRef } from "react";

const Navigate = (props: React.PropsWithChildren) => {
    return <nav className={styles.navMenu}>{props.children}</nav>;
}

interface NavigateItemProps extends React.PropsWithChildren {
    active?: boolean;
}
const NavigateItem = (props: NavigateItemProps) => {
    const { token } = theme.useToken();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref;
        current?.style.setProperty("--navItem-underline-background-color", token.colorPrimary);
    }, [token.colorPrimary]);

    return <div ref={ref} className={[styles.navItem, props.active && styles.navItemSelected].join(" ")}>
        {props.children}
    </div>
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

    return <div className={styles.navButton}>
        <Dropdown menu={{ items: props.items }} trigger={["click"]} placement="bottom">
            <Button type="primary" icon={<List size={18} />} size="large" />
        </Dropdown>
    </div>
}

interface ContentProps extends React.RefAttributes<HTMLElement> {
    label: React.ReactNode;
    icon: React.ReactNode;
}
const Content = forwardRef(({ label, icon, ...props }: ContentProps, ref: React.ForwardedRef<HTMLElement>) => {
    const { token } = theme.useToken();

    return <Flex gap={8} ref={ref} align="center" {...props}>
        <span className={styles.navText} style={{ color: token.colorText }}>{icon}</span>
        <span className={styles.navText} style={{ color: token.colorText }}>{label}</span>
    </Flex>
});

const { useBreakpoint } = Grid;
const dropDownItemStyle: React.CSSProperties = {
    fontSize: 18, padding: "0.5em 1em"
}
export default function NavigateMenu() {
    const { pathname } = useLocation();
    const { xl, lg, md } = useBreakpoint();

    const members: MenuProps["items"] = [
        {
            key: "leader", icon: <PersonSquare size={dropDownItemStyle.fontSize} />,
            label: <Link to="https://www.instagram.com/0z3.1415926/" target="_blank" rel="noopener noreferrer">
                <span>林立山</span>
            </Link>,
            style: dropDownItemStyle,
        },
        {
            key: "mate1", icon: <PersonFill size={dropDownItemStyle.fontSize} />,
            label: <Link to="https://www.instagram.com/itsuki_f6/" target="_blank" rel="noopener noreferrer">
                <span>蔡岳哲</span>
            </Link>,
            style: dropDownItemStyle,
        },
        {
            key: "mate2", icon: <PersonFill size={dropDownItemStyle.fontSize} />,
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
            label: <Dropdown menu={{ items: members }} trigger={["click"]} placement="bottom">
                <Content label="團隊" icon={<PeopleFill />} />
            </Dropdown>,
            hidden: !md,
        },
        {
            key: "github",
            label: <Link to="https://github.com/ian5030560/simple-note-2" target="_blank" rel="noreferrer">
                <Content label="GIthub" icon={<GithubOutlined />} />
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
        {!xl && <NavigateMenuButton items={items.map(({active, ...rest}) => rest).filter(it => it.hidden)} />}
    </Navigate>
}