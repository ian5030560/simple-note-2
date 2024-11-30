import { Flex, theme, Image, Typography, Row, Col } from "antd";
import { Outlet } from "react-router-dom";
import { ThemeSwitchButton } from "../util/theme";
import Note from "../../public/notesbook.png";
import NavigateMenu from "./navigateMenu";
import styles from "./index.module.css";


const NoteImage: React.FC = () => <Image src={Note} alt="" width={64} height={64} preview={false} />

const Brand = () => {
    return <Flex align="center" gap="small">
        <NoteImage />
        <Typography.Title level={2} ellipsis>Simple-Note-2</Typography.Title>
    </Flex>
}

const Container = (props: React.PropsWithChildren) => <Flex justify="center">
    <div className={styles.container}>{props.children}</div>
</Flex>;

export default function WelcomeLayout() {
    const { token } = theme.useToken();

    return <Flex vertical style={{ minHeight: "100%", backgroundColor: token.colorBgBase, padding: "0px 8px" }}>
        <Container>
            <Row align="middle" justify="space-between">
                <Col sm={20} md={12}><Brand /></Col>
                <Col sm={4} md={12}>
                    <Flex justify={"end"}><NavigateMenu /></Flex>
                </Col>
            </Row>
        </Container>
        <div style={{ backgroundColor: token.colorBgBase, flexGrow: 1 }}>
            <Outlet />
        </div>
        <ThemeSwitchButton />
    </Flex>
}