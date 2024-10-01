import React, { useRef } from "react";
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
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";

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
                    if(root.isEmpty()){
                        const p = $createParagraphNode();
                        root.append(p);
                        p.select();
                    }
                }} />
        }
        {!test && collab && room && <CollaboratePlugin room={room} initialNote={initialNote} cursorsContainerRef={containerRef} />}

        <div id="editor-scroller" className={styles.editorScroller}>
            <div id="editor-anchor" className={styles.anchor}>
                {Loader.plugins.map((plugin, index) => <React.Fragment key={index}>{plugin}</React.Fragment>)}
            </div>
        </div>
    </LexicalComposer>;
}

export default function Editor() {
    const data = useLoaderData();
    const navigate = useNavigate();
    const { id, host } = useParams();

    const error = data === false;
    const collab = !!(id && host);
    return !error ? <InnerEditor initialNote={data as string} collab={collab} room={collab ? `${id}/${host}` : undefined} /> :
        <Flex justify="center" align="center" style={{ height: "100%" }}>
            <Result status={"error"} title="取得內容失敗" subTitle="此筆記無法取得內容，請重新整理"
                extra={<Button type="primary" icon={<SyncOutlined />} onClick={() => navigate(0)}>重新整理</Button>} />
        </Flex>;
};