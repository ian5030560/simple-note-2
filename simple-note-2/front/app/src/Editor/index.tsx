import { useLoaderData, useNavigation, useParams } from "react-router-dom";
import { notification, Skeleton, Spin } from "antd";
import styles from "./index.module.css";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { EditorState, LexicalNode } from "lexical";
import { $isImageNode } from "./nodes/image";
import useAPI from "../util/api";
import { $isVideoNode } from "./nodes/video";
import { $isDocumentNode } from "./nodes/document";
import { useNodes } from "../User/SideBar/NoteTree/store";
import { Typography } from "antd";
import useNoteManager from "../User/SideBar/NoteTree/useNoteManager";

function Loading() {
    return <div className={styles.loading}>
        <Skeleton title paragraph={{ rows: 20 }} />
    </div>;
}

const Editor = React.lazy(() => import("./editor"));

interface LongWaitingProps {
    delay: number;
    text?: string;
}
const LongWaiting = (props: LongWaitingProps) => {
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
            }, props.delay);
        }
        return () => { if (id) clearTimeout(id) }
    }, [navigation.state, props.delay]);

    return waiting ? <Spin spinning fullscreen size="large" tip={props.text} /> : null;
}

function createFormData(data: Record<string, any>) {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    return formData;
}

export default () => {
    const data = useLoaderData() as string | null | false;
    const { id, host } = useParams();
    const collab = !!(id && host);
    const navigation = useNavigation();
    const [{ username }] = useCookies(["username"]);
    const deleteFile = useAPI(APIs.deleteFile);
    // const { findNode } = useNodes();
    const {find, save} = useNoteManager();
    const [api, contextHolder] = notification.useNotification();
    // const saveNote = useAPI(APIs.saveNote);
    console.log(data);
    const insertFile = useCallback((file: File) => {
        const node = find(id!);
        const data = createFormData({
            username: username,
            filename: file.name,
            notename: node!.title as string,
            content: file
        });

        return fetch(APIs.addFile, {
            body: data, method: "POST",
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            }
        }).then(res => {
            if (!res.ok) throw new Error(`${file.name} is not uploaded successfully`);
            return res.text();
        }).catch(() => { throw new Error(`${file.name} is not uploaded successfully`); });

    }, [find, id, username]);

    const destroyFile = useCallback((node: LexicalNode) => {
        let param: { username: string, url?: string, note_title_id: string } = { username, note_title_id: id! };
        if ($isImageNode(node) || $isVideoNode(node) || $isDocumentNode(node)) {
            param.url = node.getSrc();
        }
        else {
            throw new Error(`${node.__type} is not supported by deleteFile`);
        }

        deleteFile({ ...param, url: param.url })[0]
            .then(res => { if (!res.ok) throw new Error(`Your file: ${param.url} failed to be deleted`); })
            .catch(() => { throw new Error(`Your file: ${param.url} failed to be deleted`); });

    }, [deleteFile, id, username]);

    const handleError = useCallback((err: Error) => {
        api.error({
            message: "發生錯誤",
            description: <>
                <Typography.Text type="danger">{err.message}</Typography.Text>
                <Typography.Paragraph type="secondary">{err.stack}</Typography.Paragraph>
            </>,
            placement: "bottomRight",
            style: { maxHeight: "30%", overflow: "auto" }
        });
    }, [api]);

    const handleSave = useCallback((editorState: EditorState) => {
        // save(id!, editorState);
        // saveNote({
        //     username: username,
        //     noteId: id!,
        //     content: JSON.stringify(editorState.toJSON()),
        // })[0].then((res) => {
        //     if (res.ok) {
        //         console.log("saved!!");
        //     }
        //     else{
        //         throw new Error("Failed to save");
        //     }
        // }).catch(() => {
        //     throw new Error("Failed to save");
        // });
    }, []);
    
    return <>
        <Suspense fallback={<Loading />}>
            {
                navigation.state !== "loading" && <Editor initialEditorState={data !== false ? data : undefined} collab={collab}
                    room={collab ? `${id}/${host}` : undefined} username={username} onSave={handleSave}
                    insertFile={insertFile} destroyFile={destroyFile} whenRaiseError={handleError}/>
            }
        </Suspense>
        <LongWaiting delay={500} text="正在載入內容" />
        {contextHolder}
    </>
};