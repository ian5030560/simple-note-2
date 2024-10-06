import { isRouteErrorResponse, useLoaderData, useNavigate, useNavigation, useParams, useRouteError } from "react-router-dom";
import { Button, Flex, Result, Skeleton } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Editor from "./editor";
import styles from "./index.module.css";

function Loading() {
    return <div className={styles.loading}>
        <Skeleton title paragraph={{ rows: 20 }} />
    </div>;
}
export default () => {
    const data = useLoaderData() as string | null;
    const navigation = useNavigation();
    const { id, host } = useParams();
    const collab = !!(id && host);

    return navigation.state === "loading" ? <Loading /> :
        <>
            {!collab && <Editor initialNote={data}/>}
            {collab && <Editor collab initialNote={data} room={`${id}/${host}`}/>}
        </>;
};


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