import { useLoaderData, useNavigation, useParams } from "react-router-dom";
import { Skeleton } from "antd";
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