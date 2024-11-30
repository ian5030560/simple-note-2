import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SideBar, { ExportValues } from "./sideBar";
import { Row, Col, theme, notification, Grid, Flex } from "antd";
import Preview from "./preview";
import { defaultSeed, ThemeSwitchButton } from "../util/theme";
import useAPI from "../util/api";
import useUser from "../util/useUser";
import { EyeFill, PencilSquare } from "react-bootstrap-icons";
import styles from "../Welcome/navigateMenu.module.css";

const ThemePage = () => {
    return <>
        <Index />
        <ThemeSwitchButton />
    </>
}

const Tab = (props: React.PropsWithChildren) => <Flex className={styles.navMenu}>{props.children}</Flex>

interface TabItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}
const TabItem = (props: TabItemProps) => {
    const { token } = theme.useToken();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref;
        if (!current) return;
        current.style.setProperty("--navItem-underline-background-color", token.colorPrimary);
    }, [token.colorPrimary]);

    return <div ref={ref} className={[styles.navItem, props.active && styles.navItemSelected].join(" ")} onClick={props.onClick}>
        <Flex align="center" justify="center" gap={8} style={{ color: token.colorText }}>
            <span className={styles.navText}>{props.icon}</span>
            <span className={styles.navText}>{props.label}</span>
        </Flex>
    </div>
}

type TabItemData = TabItemProps & {
    key: React.Key;
}

const { useBreakpoint } = Grid;

const Index = () => {
    const [darken, setDarken] = useState(false);
    const [lightPrimary, setLightPrimary] = useState(defaultSeed.colorLightPrimary);
    const [lightNeutral, setLightNeutral] = useState(defaultSeed.colorLightNeutral);
    const [darkPrimary, setDarkPrimary] = useState(defaultSeed.colorDarkPrimary);
    const [darkNeutral, setDarkNeutral] = useState(defaultSeed.colorDarkNeutral);
    const { token } = theme.useToken();
    const [api, contextHolder] = notification.useNotification();
    const { theme: { add } } = useAPI();
    const { username } = useUser();
    const { md } = useBreakpoint();
    const [tabKey, setTabKey] = useState<"edit" | "preview">("edit");

    const handleExport = useCallback((name: string, values: ExportValues) => {
        if (!username) return;
        add(username, {
            name: name,
            data: {
                colorLightPrimary: values.lightPrimary,
                colorLightNeutral: values.lightNeutral,
                colorDarkPrimary: values.darkPrimary,
                colorDarkNeutral: values.darkNeutral
            }
        }).then((ok) => {
            if (!ok) throw new Error();
            api.success({ message: "新增主題成功", description: "已將主題新增至帳號裡" });
        }).catch(() => api.error({ message: "新增主題失敗", description: "無法新增主題至帳號裡" }));

    }, [add, api, username]);

    const items: TabItemData[] = [
        {
            key: "edit",
            icon: <PencilSquare />,
            label: "編輯",
            onClick: () => setTabKey("edit"),
            active: tabKey === "edit"
        },
        {
            key: "preview",
            icon: <EyeFill />,
            label: "預覽",
            onClick: () => setTabKey("preview"),
            active: tabKey === "preview"
        },
    ];

    const previewContext = useMemo(() => <Preview theme={{
        token: {
            colorPrimary: darken ? darkPrimary : lightPrimary,
            colorBgBase: darken ? darkNeutral : lightNeutral,
        },
        algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }} />, [darkNeutral, darkPrimary, darken, lightNeutral, lightPrimary]);


    return <Flex vertical style={{ minHeight: "100%", backgroundColor: token.colorBgBase }}>
        {
            !md && <Tab>
                {items.map(({ key, ...item }) => <TabItem key={key} {...item} />)}
            </Tab>
        }
        <Row style={{ flex: 1, padding: "1em" }}>
            <Col md={8} lg={6} span={tabKey === "edit" ? 24 : 0}>
                <SideBar
                    light={{
                        primary: lightPrimary,
                        neutral: lightNeutral,
                        onPrimaryChange: (color) => setLightPrimary(color),
                        onNeutralChange: (color) => setLightNeutral(color)
                    }}
                    dark={{
                        primary: darkPrimary,
                        neutral: darkNeutral,
                        onPrimaryChange: (color) => setDarkPrimary(color),
                        onNeutralChange: (color) => setDarkNeutral(color)
                    }}
                    onDarken={() => setDarken(prev => !prev)}
                    onExport={handleExport}
                />
            </Col>
            <Col span={tabKey === "preview" ? 24 : 0} md={16} lg={18}>
                {((!md && tabKey === "preview") || md) && previewContext}
            </Col>
            {contextHolder}
        </Row>
    </Flex>
}
export default ThemePage;