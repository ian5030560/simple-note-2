import { useLoaderData, useNavigation, useParams } from "react-router-dom";
import { Skeleton, Spin } from "antd";
import styles from "./index.module.css";
import React, { Suspense, useEffect, useState } from "react";

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
    const [waiting, setWaiting] = useState(false);

    useEffect(() => {
        let id: NodeJS.Timeout | undefined = undefined;
        if (navigation.state !== "loading") {
            setWaiting(false);
        }
        else {
            id = setTimeout(() => {
                setWaiting(true);
            }, 1000);
        }

        return () => { if (id) clearTimeout(id) }
    }, [navigation.state]);

    return <>
        <Suspense fallback={<Loading />}>
            <Editor initialNote={data !== false ? data : undefined} collab={collab}
                room={collab ? `${id}/${host}` : undefined} />
        </Suspense>
        {waiting && <Spin spinning fullscreen size="large"/>}
    </>
};