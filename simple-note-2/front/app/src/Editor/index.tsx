import React, { useEffect, useMemo, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Button, Flex, Result } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { LOADER_WORD, NoteContentType } from "../util/provider";
import useAPI from "../util/api";
import { decodeBase64 } from "../util/secret";
import Editor from "./editor";

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

export default () => {
    const data = useLoaderData() as (NoteContentType | LOADER_WORD) | undefined;
    const { id, host } = useParams();
    const getNote = useAPI(APIs.getNote);
    const [contentError, contentErrorContext] = useErrorBoard("取得失敗", "此筆記無法取得內容，請重新整理");
    const [collborateError, collborateErrorContext] = useErrorBoard("連線失敗", "此筆記無法取得連線，請重新整理");
    const collab = !!(id && host);

    useEffect(() => {
        if(data === undefined) return;
        
        let con = false;
        let col = false;

        if(typeof data === "string" || data === null){
            con = false;
        }
        else if(data === LOADER_WORD.CONTENT_ERROR){ 
            con = true;
        }
        else{
            col = data === LOADER_WORD.COLLABORATE_FAIL;
        }

        contentError(con);
        collborateError(col);

    }, [collborateError, contentError, data]);

    return data !== undefined ? <>
        {!collab && data !== LOADER_WORD.CONTENT_ERROR && <Editor initialNote={data as NoteContentType} />}
        {
            collab && data === LOADER_WORD.COLLABORATE_SUCCESS && <Editor collab room={`${id}/${host}`}
                initialNote={async (editor) => {
                    const content = await getNote({ username: decodeBase64(host), noteId: id })[0]
                        .then(res => res.ok ? res.text() : undefined)
                        .catch(() => undefined);

                    if (!content) {
                        contentError(true);
                    }
                    else{
                        const editorState = editor.parseEditorState(JSON.parse(content));
                        editor.setEditorState(editorState, {tag: "history-merge"});
                    }
                }} />
        }
        {contentErrorContext}
        {collborateErrorContext}
    </> : null
};