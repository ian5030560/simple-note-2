import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Button, Flex, Result } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { LOADER_WORD, NoteContentType } from "../util/provider";
import useAPI from "../util/api";
import { decodeBase64 } from "../util/secret";
import Editor from "./editor";
import { LexicalEditor } from "lexical";

function useErrorBoard(title: string, subTitle: string): [(value: boolean) => void, React.JSX.Element] {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const contextHolder = useMemo(() => <>
        {
            open && <Flex justify="center" align="center" style={{ height: "100%" }}>
                <Result status={"error"} title={title} subTitle={subTitle}
                    extra={<Button type="primary" icon={<SyncOutlined />} onClick={() => navigate(0)}>重新整理</Button>} />
            </Flex>
        }
    </>, [navigate, open, subTitle, title]);

    const error = (value: boolean) => setOpen(value);

    return [error, contextHolder];
}

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

export default () => {
    const data = useLoaderData() as NoteContentType | LOADER_WORD;
    const { id, host } = useParams();
    const getNote = useAPI(APIs.getNote);
    const [contentError, setContentError] = useState(false);
    const [collabError, setCollabError] = useState(false);
    const collab = !!(id && host);

    useEffect(() => {
        setCollabError(data === LOADER_WORD.COLLABORATE_FAIL);
        setContentError(data === LOADER_WORD.CONTENT_ERROR);
    }, [data]);

    const $createCollabNote = useCallback(async (editor: LexicalEditor) => {
        if (!host || !id) return;

        const content = await getNote({ username: decodeBase64(host), noteId: id })[0]
            .then(res => res.ok ? res.text() : undefined)
            .catch(() => undefined);

        if (!content) {
            setContentError(true);
        }
        else {
            const editorState = editor.parseEditorState(JSON.parse(content));
            editor.setEditorState(editorState, { tag: "history-merge" });
        }
    }, [getNote, host, id, setContentError]);

    return <>
        {!collab && !contentError && <Editor initialNote={data as NoteContentType} />}
        {
            collab && !collabError && <Editor collab room={`${id}/${host}`}
                initialNote={$createCollabNote} onCollabError={() => setCollabError(true)} />
        }
        <ErrorBoard open={contentError} title="取得失敗" subTitle="此筆記無法取得內容，請重新整理"/>
        <ErrorBoard open={collabError} title="連線失敗" subTitle="此筆記無法取得連線，請重新整理"/>
    </>
};