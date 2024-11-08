import { useLoaderData, useNavigation, useParams } from "react-router-dom";
import { Button, notification, Skeleton, Spin } from "antd";
import styles from "./index.module.css";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { EditorState, LexicalNode } from "lexical";
import { $isImageNode } from "./nodes/image";
import useAPI from "../util/api";
import { $isVideoNode } from "./nodes/video";
import { $isDocumentNode } from "./nodes/document";
import { Typography } from "antd";
import useNoteManager, { getNoteStore, NoteObject, operate } from "../User/SideBar/NoteTree/useNoteManager";

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

export default () => {
    const data = useLoaderData() as string | null | false;
    const { id, host } = useParams();
    const collab = !!(id && host);
    const navigation = useNavigation();
    const [{ username }] = useCookies(["username"]);
    const { file, note } = useAPI();
    // const { findNode } = useNodes();
    const { find, save } = useNoteManager();
    const [api, contextHolder] = notification.useNotification();
    const [isStored, setIsStored] = useState(true);

    useEffect(() => {
        const interval = setInterval(async () => {
            const result = await operate<NoteObject | undefined>(async () => {
                const Note = await getNoteStore();
                return Note.get(id!);
            });

            if (!result) {
                return api.warning({
                    message: "儲存異常",
                    description: <>
                        <Typography.Text type="warning">無法正常讀取本地儲存，建議重整頁面</Typography.Text>
                        <Button type="primary" onClick={() => window.location.reload()}>重整頁面</Button>
                    </>
                })
            }

            if (!result.uploaded) {
                return
            }
        }, 2500);

        return clearInterval(interval);
    }, [api, id]);

    useEffect(() => {
        function handleBeforeUnload(e: WindowEventMap["beforeunload"]) {

        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    const insertFile = useCallback((f: File) => {
        const node = find(id!);

        return file.add(username, f, node!.title).then(res => {
            if (!res.ok) throw new Error(`${f.name} is not uploaded successfully`);
            return res.text();
        }).catch(() => { throw new Error(`${f.name} is not uploaded successfully`); });

    }, [file, find, id, username]);

    const destroyFile = useCallback((node: LexicalNode) => {
        let url: string;
        if ($isImageNode(node) || $isVideoNode(node) || $isDocumentNode(node)) {
            url = node.getSrc();
        }
        else {
            throw new Error(`${node.__type} is not supported by deleteFile`);
        }

        file.delete(username, url, id!)
            .then(res => { if (!res.ok) throw new Error(`Your file: ${url} failed to be deleted`); })
            .catch(() => { throw new Error(`Your file: ${url} failed to be deleted`); });

    }, [file, id, username]);

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

    const handleSave = useCallback(async (editorState: EditorState) => {
        await save(id!, editorState);
        setIsStored(false);
        const _id = id!;
        const content = editorState;

        setTimeout(async () => {
            const result = await operate<NoteObject | undefined>(async () => {
                const Note = await getNoteStore();
                return Note.get(_id);
            });

            if (!result) {
                note.save(username, _id, content)
                    .catch(() => {

                    });
                return api.warning({
                    message: "儲存異常",
                    description: <>
                        <Typography.Text type="warning">無法正常讀取本地儲存，建議重整頁面</Typography.Text>
                        <Button type="primary" onClick={() => window.location.reload()}>重整頁面</Button>
                    </>
                })
            }

            if (!result.uploaded) {
                return
            }
        }, 2500);

    }, [api, id, note, save, username]);

    return <>
        <Suspense fallback={<Loading />}>
            {
                navigation.state !== "loading" && <Editor initialEditorState={data !== false ? data : undefined} collab={collab}
                    room={collab ? `${id}/${host}` : undefined} username={username} onSave={handleSave}
                    insertFile={insertFile} destroyFile={destroyFile} whenRaiseError={handleError} />
            }
        </Suspense>
        <LongWaiting delay={500} text="正在載入內容" />
        {contextHolder}
    </>
};