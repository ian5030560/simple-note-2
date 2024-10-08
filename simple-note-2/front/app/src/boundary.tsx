import { SyncOutlined } from "@ant-design/icons";
import { Flex, Result, Button } from "antd";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

interface ErrorBoardProps {
    title: string;
    subTitle: string;
    open: boolean;
}
function ErrorBoard(props: ErrorBoardProps) {
    const navigate = useNavigate();

    return props.open ? <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Result status={"error"} title={props.title} subTitle={props.subTitle}
            extra={<Button type="primary" icon={<SyncOutlined />} onClick={() => navigate(0)}>重新整理</Button>} />
    </Flex> : null;
}

export function EditorErrorBoundary() {
    const error = useRouteError() as Response;

    return isRouteErrorResponse(error) ? <>
        <ErrorBoard open={error.status === 404} title="取得失敗" subTitle="此筆記無法取得內容，請重新整理" />
        <ErrorBoard open={error.status === 403} title="連線失敗" subTitle="此筆記無法取得連線，請重新整理" />
    </> : null;
}

export function SettingErrorBoundary() {
    const error = useRouteError() as Response;

    return isRouteErrorResponse(error) ? <>
        <ErrorBoard open={error.status === 404} title="初始化失敗" subTitle="無法取得個人資訊" />
        <ErrorBoard open={error.status === 410} title="初始化失敗" subTitle="無法取得所有筆記資訊"/>
    </> : null;
}