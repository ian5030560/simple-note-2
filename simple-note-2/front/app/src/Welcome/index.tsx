import { Flex, theme, Image, Typography, Menu, ConfigProvider, Divider, Row, Col } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ThemeSwitchButton } from "../util/theme";
import Note from "../../public/notesbook.png";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { FormOutlined, GithubOutlined } from "@ant-design/icons";
import { HouseDoorFill, PeopleFill, PersonSquare, PersonFill, PersonCircle } from "react-bootstrap-icons";

const NoteImage: React.FC = () => <Image src={Note} alt="" width={64} height={64} preview={false} />

const Brand = () => {
    return <Flex justify="center" align="center" gap="small">
        <NoteImage />
        <Typography.Title level={2} ellipsis>Simple-Note-2</Typography.Title>
    </Flex>
}

const itemStyle: React.CSSProperties = {flex: "auto", textAlign: "center"};
const NaivgateMenu = () => {
    const { pathname } = useLocation();

    const items: ItemType<MenuItemType>[] = [
        {
            key: "/", icon: <HouseDoorFill />,
            label: <Link to="/">
                <Typography.Text>介紹</Typography.Text>
            </Link>,
            style: itemStyle
        },
        {
            key: "team", label: <Typography.Text>團隊</Typography.Text>,
            style: itemStyle, icon: <PeopleFill />,
            children: [
                {
                    key: "leader", icon: <PersonSquare />,
                    label: <Link to="https://www.instagram.com/0z3.1415926/" target="_blank" rel="noopener noreferrer">
                        <Typography.Text>林立山</Typography.Text>
                    </Link>,
                },
                {
                    key: "mate1", icon: <PersonFill />,
                    label: <Link to="https://www.instagram.com/itsuki_f6/" target="_blank" rel="noopener noreferrer">
                        <Typography.Text>蔡岳哲</Typography.Text>
                    </Link>,
                },
                {
                    key: "mate2", icon: <PersonFill />,
                    label: <Typography.Text>李泓逸</Typography.Text>
                }
            ],

        },
        {
            label: <Link to="https://github.com/ian5030560/simple-note-2">
                <Typography.Text>GitHub</Typography.Text>
            </Link>,
            key: "github", icon: <GithubOutlined />,
            style: itemStyle
        },
        {
            key: "playground", icon: <FormOutlined />,
            label: <Link to={"/playground"}>
                <Typography.Text>Playground</Typography.Text>
            </Link>,
            style: itemStyle
        },
        {
            key: "/auth",
            icon: <PersonCircle />,
            label: <Link to="/auth">
                <Typography.Text>登入/註冊</Typography.Text>
            </Link>,
            style: itemStyle
        }
    ]

    return <ConfigProvider theme={{ components: { Typography: { fontSize: 16 } } }}>
        <Menu items={items} mode="horizontal" triggerSubMenuAction="click" defaultSelectedKeys={[pathname]} />
    </ConfigProvider>
}

export default function WelcomeLayout() {
    const { token } = theme.useToken();

    return <Flex vertical style={{ height: "100%" }}>
        <Row align={"middle"} style={{ backgroundColor: token.colorBgBase, padding: "1em 1em" }}>
            <Col span={12}><Brand /></Col>
            <Col span={9}><NaivgateMenu /></Col>
        </Row>
        <div style={{ backgroundColor: token.colorBgBase, flexGrow: 1 }}>
            <Outlet />
        </div>
        <ThemeSwitchButton />
    </Flex>
}