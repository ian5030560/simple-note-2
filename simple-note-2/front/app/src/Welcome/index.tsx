import { Flex, theme, Image, Typography, Row, Col, FloatButton } from "antd";
import { Outlet } from "react-router-dom";
import Note from "../../public/notesbook.png";
import NavigateMenu from "./navigateMenu";
import styles from "./index.module.css";
import { OfficialDarkButton } from "../util/theme";


const NoteImage = () => <Image src={Note} alt="" width={64} height={64} preview={false} />

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

    return <Flex vertical style={{
        height: "100%", backgroundColor: token.colorBgBase,
        padding: 8, boxSizing: "border-box"
    }}>
        <Container>
            <Row align="middle" justify="space-between" wrap={false}>
                <Col sm={20} md={12}><Brand /></Col>
                <Col sm={4} md={12}>
                    <Flex justify={"end"}><NavigateMenu /></Flex>
                </Col>
            </Row>
        </Container>
        <div style={{ flex: 1, overflow: "auto" }}>
            <Outlet />
        </div>
        <FloatButton.Group>
            <FloatButton.BackTop />
            <OfficialDarkButton />
        </FloatButton.Group>
    </Flex>
}