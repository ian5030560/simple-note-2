import React, { useEffect, useMemo, useRef, useState } from "react";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import ToolBarPlugin from "./ToolBar/index";
import DraggablePlugin from "./Draggable";
import loader from "./loader";
import PLUSLIST from "./PlusList";
import CollaboratePlugin from "./Collaborate";
import SavePlugin, { InitialNoteType } from "./Save";
import ToolKitPlugin from "./ToolKit";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Button, Flex, Result } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import { $createParagraphNode, $getRoot, CLEAR_EDITOR_COMMAND } from "lexical";
import { LOADER_WORD, NoteContentType } from "../util/provider";
import useAPI, { APIs } from "../util/api";

function onError(error: Error) {
    console.error(error);
}

const Loader = loader();
interface InnerEditorProps {
    test?: boolean;
    collab?: boolean;
    initialNote?: InitialNoteType;
    room?: string;
}
export const InnerEditor = ({ test, collab, initialNote, room }: InnerEditorProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return <LexicalComposer
        initialConfig={{
            namespace: 'Editor', theme: Loader.theme, onError, nodes: Loader.nodes,
            /** @see https://lexical.dev/docs/collaboration/react */
            editorState: collab ? null : undefined,
        }}>
        {!test && !collab && <SavePlugin initialNote={initialNote} />}
        <ToolBarPlugin />
        <ToolKitPlugin />
        <DraggablePlugin items={PLUSLIST} />
        {
            test && collab && <CollaboratePlugin room="test" cursorsContainerRef={containerRef}
                initialNote={() => {
                    const root = $getRoot();
                    if (root.isEmpty()) {
                        const p = $createParagraphNode();
                        root.append(p);
                        p.select();
                    }
                }} />
        }
        {!test && collab && room && <CollaboratePlugin room={room} initialNote={initialNote} cursorsContainerRef={containerRef} />}

        <div id="editor-scroller" className={styles.editorScroller}>
            <div id="editor-anchor" className={styles.anchor}>
                {Loader.plugins.map((plugin, index) => <React.Fragment key={`${plugin?.toString()}-${index}`}>{plugin}</React.Fragment>)}
            </div>
        </div>
    </LexicalComposer>;
}

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

export default function Editor() {
    const data = useLoaderData() as (NoteContentType | LOADER_WORD) | undefined;
    const { id, host } = useParams();
    const getNote = useAPI(APIs.getNote);
    const [contentError, contentErrorContext] = useErrorBoard("取得失敗", "此筆記無法取得內容，請重新整理");
    const [accessError, accessErrorContext] = useErrorBoard("連線失敗", "此筆記無法取得連線，請重新整理");
    const collab = !!(id && host);

    useEffect(() => {
        if(!data) return;
        
        if(typeof data === "string" || data === null){
            contentError(false);
        }
        else{  
            if(data === LOADER_WORD.CONTENT_ERROR){
                contentError(true);
            }
            else{
                accessError(data === LOADER_WORD.COLLABORATE_FAIL);
            }
        }

    }, [accessError, contentError, data]);

    if(data === undefined) return null;

    return <>
        {!collab && data !== LOADER_WORD.CONTENT_ERROR && <InnerEditor initialNote={data as NoteContentType} />}
        {
            collab && data === LOADER_WORD.COLLABORATE_SUCCESS && <InnerEditor collab room={`${id}/${host}`}
                initialNote={async (editor) => {
                    const content = await getNote({ username: host, noteId: id })[0]
                        .then(res => !res.ok ? res.text() : undefined)
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
        {accessErrorContext}
    </>
};