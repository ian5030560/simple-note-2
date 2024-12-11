import { useLoaderData, useNavigate, useNavigation, useParams } from "react-router-dom";
import { Button, Flex, notification, Skeleton, Spin } from "antd";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { EditorState, LexicalNode, SerializedEditorState } from "lexical";
import useAPI from "../util/api";
import { Typography } from "antd";
import useNoteManager from "../util/useNoteManager";
import { SimpleNote2IndexedDB } from "../util/store";
import useUser from "../util/useUser";
import { $isImageNode } from "./nodes/image";
import { $isVideoNode } from "./nodes/video";
import { $isDocumentNode } from "./nodes/document";

function Loading() {
    return <div style={{ height: "100%", padding: 50, overflowY: "auto" }}>
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

enum SAVE{
    WAIT, WATCH, SEND
}
export default () => {
    const data = useLoaderData() as string | null | false;
    const { id, host } = useParams();
    const collab = !!(id && host);
    const navigation = useNavigation();
    const { username } = useUser();
    const { file, note } = useAPI();
    const { find, save } = useNoteManager();
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const saveStateRef = useRef(SAVE.WAIT);

    const handleSaveToServer = useCallback((username: string, id: string, content: SerializedEditorState | null, keepAlive?: boolean) => {
        saveStateRef.current = SAVE.SEND;
        note.save(username, id, JSON.stringify(content), keepAlive)
            .then(ok => { if (!ok) throw new Error(); })
            .catch(() => {
                api.error({
                    message: "儲存錯誤",
                    description: <Flex vertical gap={5}>
                        <Typography.Text>無法發送內容至伺服器，請勿繼續更新目前內容，請嘗試手動發送</Typography.Text>
                        <Button type="primary" block onClick={() => handleSaveToServer(username, id, content, keepAlive)}>重新發送</Button>
                    </Flex>
                })
            }).finally(() => {
                saveStateRef.current = SAVE.WAIT;
            })

        const db = new SimpleNote2IndexedDB();
        db.update({ id, content, uploaded: true });
        
    }, [api, note]);

    useEffect(() => {
        if (collab) return;

        const interval = setInterval(async () => {

            const db = new SimpleNote2IndexedDB();
            const result = await db.get(id!);

            if (!result) {
                return api.warning({
                    message: "儲存異常",
                    description: <Flex vertical gap={5}>
                        <Typography.Text type="warning">無法正常讀取本地快取，建議重整頁面</Typography.Text>
                        <Button type="primary" block onClick={() => navigate(0)}>重整頁面</Button>
                    </Flex>
                });
            }

            if (!result.uploaded) {
                handleSaveToServer(username!, id!, result.content);
                console.log("saved");
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [api, collab, handleSaveToServer, id, navigate, username]);

    useEffect(() => {
        if (collab) return;

        async function handleBeforeUnload(e: BeforeUnloadEvent) {
            const db = new SimpleNote2IndexedDB();
            const result = await db.get(id!);

            if (!result) return;

            if (!result.uploaded) {
                handleSaveToServer(username!, id!, result.content, true);
                e.preventDefault();
                e.returnValue = true;
            }
        }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [collab, handleSaveToServer, id, username]);

    const insertFileInCollab = useCallback(async (f: File) => {
        const node = find(`${id} ${host}`, "multiple");

        const [, ...key] = node!.key.split(" ").reverse();
        const noteId = key.reverse().join("");

        try {
            return await file.add(atob(host!), f, noteId);
        } catch {
            throw new Error(`${f.name} is not uploaded successfully`);
        }
    }, [file, find, host, id]);

    const insertFile = useCallback(async (f: File) => {
        const node = find(id!);
        const user = username!;
        try {
            return await file.add(user, f, node!.key);
        } catch {
            throw new Error(`${f.name} is not uploaded successfully`);
        }

    }, [file, find, id, username]);

    const destroyFile = useCallback((node: LexicalNode) => {
        let url: string;
        if ($isImageNode(node) || $isVideoNode(node) || $isDocumentNode(node)) {
            url = node.getSrc();
        }
        else {
            throw new Error(`${node.__type} is not supported by deleteFile`);
        }
        const user = id && host ? atob(host) : username!;

        file.delete(user, url, id!).then(ok => { if (!ok) throw new Error(); })
            .catch(() => { throw new Error(`Your file: ${url} failed to be deleted`); });

    }, [file, host, id, username]);

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
        if(saveStateRef.current === SAVE.SEND) return;
        await save(id!, editorState);
        console.log("save in indexeddb");
        saveStateRef.current = SAVE.WATCH;
    }, [id, save]);

    return <>
        <Suspense fallback={<Loading />}>
            {
                navigation.state !== "loading" && <Editor initialEditorState={data !== false ? data : undefined} collab={collab}
                    room={collab ? `${id}/${host}` : undefined} username={username} onSave={handleSave}
                    insertFile={collab ? insertFileInCollab : insertFile}
                    destroyFile={destroyFile} onError={handleError} />
            }
        </Suspense>
        <LongWaiting delay={500} text="正在載入內容" />
        {contextHolder}
    </>
};