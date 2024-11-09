import { SyncOutlined } from "@ant-design/icons";
import { Flex, Result, Button, notification, Typography } from "antd";
import { useEffect } from "react";
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
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isRouteErrorResponse(error) && error.status === 405) {
            api.warning({
                message: "上次內容未正確儲存",
                description: <Flex vertical gap={5}>
                    <Typography.Text>上次內容未正確儲存，可忽略或重新整理</Typography.Text>
                    <Button type="primary" onClick={() => navigate(0)}>重新整理</Button>
                </Flex>,
                placement: "bottomRight"
            });
        }
    }, [api, error, navigate]);

    return isRouteErrorResponse(error) ? <>
        <ErrorBoard open={error.status === 404} title="取得失敗" subTitle="此筆記無法取得內容，請重新整理" />
        <ErrorBoard open={error.status === 403} title="連線失敗" subTitle="此筆記無法取得連線，請重新整理" />
        {contextHolder}
    </> : null;
}

export function SettingErrorBoundary() {
    const error = useRouteError() as Response;

    return isRouteErrorResponse(error) ? <>
        <ErrorBoard open={error.status === 404} title="初始化失敗" subTitle="無法取得個人資訊" />
        <ErrorBoard open={error.status === 410} title="初始化失敗" subTitle="無法取得所有筆記資訊" />
    </> : null;
}