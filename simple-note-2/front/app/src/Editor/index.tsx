import { useLoaderData, useParams } from "react-router-dom";
import { Skeleton } from "antd";
import styles from "./index.module.css";
import React, { Suspense } from "react";

function Loading() {
    return <div className={styles.loading}>
        <Skeleton title paragraph={{ rows: 20 }} />
    </div>;
}

const Editor = React.lazy(() => import("./editor"));

export default () => {
    const data = useLoaderData() as string | null;
    const { id, host } = useParams();
    const collab = !!(id && host);

    return <Suspense fallback={<Loading/>}>
        {!collab && <Editor initialNote={data} />}
        {collab && <Editor collab initialNote={data} room={`${id}/${host}`} />}
    </Suspense>
};