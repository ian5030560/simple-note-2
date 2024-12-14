import { Col, Divider, Flex, Image, Row, Space, theme, Typography } from "antd";
import styles from "./index.module.css";
import withPageTitle from "../util/pageTitle";
import SqlAlchemyLogo from "../resource/logo/SQLAlchemy.png";
import DjangoLogo from "../resource/logo/django.png";
import TypescriptLogo from "../resource/logo/Typescript.svg.png";
import AntdLogo from "../resource/logo/antd.png";
import ReactLogo from "../resource/logo/react.png";
import MySqlLogo from "../resource/logo/MySQL.png";
import YjsLogo from "../resource/logo/yjs1.png";
import LexicalLogo from "../resource/logo/lexical.jpg";
import Notebook from "../resource/intro/notebook.png";
import Group from "../resource/intro/group.png";
import Paint from "../resource/intro/paint.png";
import Robot from "../resource/intro/robot.png";

interface IntroItemProps {
    title: string;
    description: string;
    src: string;
    alt: string;
}

const IntroItem = (props: IntroItemProps) => {
    const { token } = theme.useToken();

    return <div style={{ height: "100%" }}>
        <Space direction="vertical" size="middle" style={{
            width: "100%",height: "100%", borderRadius: 20, padding: 32,
            boxSizing: "border-box", boxShadow: token.boxShadow,
        }}>
            <Typography.Title level={2}>{props.title}</Typography.Title>
            <Image src={props.src} height={256} alt={props.alt} preview={false} />
            <Typography.Paragraph style={{ fontSize: "larger" }}>
                {props.description}
            </Typography.Paragraph>
        </Space>
    </div>
}

const logos: { src: string, alt: string }[] = [
    { src: ReactLogo, alt: "React" },
    { src: DjangoLogo, alt: "Django" },
    { src: MySqlLogo, alt: "MySOL" },
    { src: TypescriptLogo, alt: "Typescript" },
    { src: AntdLogo, alt: "Ant Design" },
    { src: LexicalLogo, alt: "Lexical" },
    { src: YjsLogo, alt: "Yjs" },
    { src: SqlAlchemyLogo, alt: "SQLAlchemy" }
]
const LogoBoard = () => {

    return <Row gutter={[32, 32]} justify="center" align="middle" style={{
        marginBottom: 32, borderRadius: 20, paddingTop: 32, paddingBottom: 32
    }}>
        {
            logos.map(logo => <Col key={logo.alt} span={24 / 3}>
                <Image width={128} src={logo.src} alt={logo.alt} preview={false} />
            </Col>)
        }
    </Row>
}

type IntroItemData = { key: React.Key } & IntroItemProps;
export default withPageTitle(function Intro() {
    const { token } = theme.useToken();

    const items: IntroItemData[] = [
        { key: "edit-note", title: "筆記編輯", description: "使用我們的筆記工具，呈現多樣貌的內容，盡情揮灑並記錄你的想法，編輯出你的專屬筆記", src: Notebook, alt: "note-edit" },
        { key: "ai-support", title: "AI輔助", description: "我們有AI可以提供預測文字，並且讓詢問你想知道的資訊，來幫助你更快更方便寫出你要的筆記", src: Robot, alt: "ai-support" },
        { key: "collaborate", title: "多人合作", description: "呼喚你的朋友或同事們，使用我們的筆記工具，一起合作編寫更好更詳細的筆記內容", src: Group, alt: "collaborate" },
        { key: "theme-edit", title: "主題編輯", description: "創建專屬你的主題，隨時隨地切換主題，使你的筆記更加多采多姿。", src: Paint, alt: "theme-edit" },
    ];

    return <Flex vertical align="center" gap={64}>
        <section style={{
            backgroundColor: token.colorPrimary, width: "100%",
            display: "flex", justifyContent: "center", padding: "64px 0px"
        }}>
            <div className={styles.container} style={{ textAlign: "center" }}>
                <Typography.Title style={{ fontSize: 64, color: "whitesmoke" }}>Simple-note-2</Typography.Title>
                <Typography.Paragraph style={{ fontSize: "larger", color: "whitesmoke" }}>
                    提供多樣化的筆記工具、AI 輔助編輯功能，以及支援多人協作的環境，讓使用者能夠方便且靈活地進行筆記編輯
                </Typography.Paragraph>
            </div>
        </section>
        <section className={styles.container} style={{ textAlign: "center" }}>
            <Row gutter={[{ md: 32 }, 32]}>
                {
                    items.map(({ key, ...item }) => <Col key={key} span={24} md={24 / 2}>
                        <IntroItem {...item} />
                    </Col>)
                }
            </Row>
        </section>
        <section className={styles.container} style={{ textAlign: "center" }}>
            <Typography.Title>工具</Typography.Title>
            <Divider />
            <LogoBoard />
        </section>
    </Flex>;
}, "介紹");