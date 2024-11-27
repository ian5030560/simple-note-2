import { Flex, theme, Image, Typography, Row, Col, Grid } from "antd";
import { Outlet } from "react-router-dom";
import { ThemeSwitchButton } from "../util/theme";
import Note from "../../public/notesbook.png";
import NavigateMenu from "./navigateMenu";

const { useBreakpoint } = Grid;

const NoteImage: React.FC = () => <Image src={Note} alt="" width={64} height={64} preview={false} />

const Brand = () => {
    const { lg } = useBreakpoint();

    return <Flex justify={lg ? "center" : "start"} align="center" gap="small">
        <NoteImage />
        <Typography.Title level={2} ellipsis>Simple-Note-2</Typography.Title>
    </Flex>
}

export default function WelcomeLayout() {
    const { token } = theme.useToken();
    const { xxl } = useBreakpoint();

    return <Flex vertical style={{ height: "100%" }}>
        <Row align={"middle"} style={{ backgroundColor: token.colorBgBase, padding: "2em 1em" }}>
            <Col xs={20} sm={12}><Brand /></Col>
            <Col xs={4} sm={12}>
                <Flex justify={xxl ? "center" : "end"}><NavigateMenu /></Flex>
            </Col>
        </Row>
        <div style={{ backgroundColor: token.colorBgBase, flexGrow: 1 }}>
            <Outlet />
        </div>
        <ThemeSwitchButton />
    </Flex>
}