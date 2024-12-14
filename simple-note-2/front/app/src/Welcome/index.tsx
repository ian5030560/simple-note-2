import { Flex, theme, Image, Typography, Row, Col, FloatButton } from "antd";
import { Outlet } from "react-router-dom";
import Note from "../../public/notesbook.png";
import NavigateMenu from "./navigateMenu";
import styles from "./index.module.css";
import { OfficialDarkButton } from "../util/theme";

const Container = (props: React.PropsWithChildren) => <div className={styles.container}>{props.children}</div>;

export default function WelcomeLayout() {
    const { token } = theme.useToken();

    return <Flex vertical style={{ height: "100%", backgroundColor: token.colorBgBase, boxSizing: "border-box" }}>
        <Flex justify="center">
            <Container>
                <Row align="middle" justify="space-around">
                    <Col lg={12} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Image src={Note} alt="圖片" width={64} height={64} preview={false} />
                        <Typography.Title level={1} style={{ flex: 1 }} ellipsis>Simple-note-2</Typography.Title>
                    </Col>
                    <Col lg={12} style={{ display: "flex", justifyContent: "end" }}>
                        <NavigateMenu />
                    </Col>
                </Row>
            </Container>
        </Flex>
        <div style={{ flex: 1, overflowY: "auto" }}>
            <Outlet />
        </div>
        <FloatButton.Group>
            <FloatButton.BackTop />
            <OfficialDarkButton />
        </FloatButton.Group>
    </Flex>
}