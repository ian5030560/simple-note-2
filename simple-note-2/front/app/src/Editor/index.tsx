import { useLoaderData, useNavigation, useParams } from "react-router-dom";
import { Skeleton } from "antd";
import styles from "./index.module.css";
import React, { Suspense } from "react";
import { useCookies } from "react-cookie";
import { LongWaiting } from "../User";

function Loading() {
    return <div className={styles.loading}>
        <Skeleton title paragraph={{ rows: 20 }} />
    </div>;
}

const Editor = React.lazy(() => import("./editor"));

export default () => {
    const data = useLoaderData() as string | null | false;
    const { id, host } = useParams();
    const collab = !!(id && host);
    const navigation = useNavigation();
    const [{ username }] = useCookies(["username"]);

    return <>
        <Suspense fallback={<Loading />}>
            {
                navigation.state !== "loading" && <Editor initialEditorState={data !== false ? data : undefined} collab={collab}
                    room={collab ? `${id}/${host}` : undefined} username={username} />
            }
        </Suspense>
        <LongWaiting delay={1000} text="正在載入內容"/>
    </>
};