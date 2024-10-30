import { useCallback, useRef } from "react";
import SavePlugin from "./plugins/savePlugin";
import { InitialEditorStateType, LexicalComposer } from "@lexical/react/LexicalComposer";
import ToolBarPlugin from "./plugins/toolbarPlugin";
import ToolKitPlugin from "./plugins/toolkitPlugin";
import DraggablePlugin from "./plugins/draggablePlugin";
import CollaboratePlugin from "./plugins/collaboratePlugin";
import { $createParagraphNode, $getRoot } from "lexical";
import styles from "./editor.module.css";
import { notification, theme, Typography } from "antd";
import themes from "./themes";
import nodes from "./nodes";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import AutoFocusPlugin from "./plugins/autoFocusPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import ListMaxLevelPlugin from "./plugins/listMaxLevel";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import LinkPlugin from "./plugins/linkPlugins/link";
import FloatingEditorLinkPlugin from "./plugins/linkPlugins/floatingLinkEditor";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { TRANSFORMERS } from '@lexical/markdown';
import CanvasPlugin from "./plugins/canvasPlugin";
import AIPlaceholderPlugin from "./plugins/AIPlugins/placeholder";
import AIQuestionPlugin from "./plugins/AIPlugins/question";
import CodeHighlightPlugin from "./plugins/codePlugins/highlight";
import CodeActionPlugin from "./plugins/codePlugins/action";
import ColumnPlugin from "./plugins/columnPlugin";
import DocumentPlugin from "./plugins/documentPlugin";
import ImagePlugin from "./plugins/imagePlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import TableActionPlugin from "./plugins/tablePlugins/action";
import TableModalPlugin from "./plugins/tablePlugins/modal";
import ImageToTextPlugin from "./plugins/imageToTextPlugin";
import VideoPlugin from "./plugins/videoPlugin";
import items from "./items";
import TableOfContentPlugin from "./plugins/tableOfContentPlugin";
import MathPlugin from "./plugins/mathPlugin";

function $createEmptyForCollab() {
    const root = $getRoot();
    if (root.isEmpty()) {
        const p = $createParagraphNode();
        root.append(p);
        p.select();
    }
}

interface EditorProps {
    test?: boolean;
    collab?: boolean;
    initialEditorState?: InitialEditorStateType;
    room?: string;
    username?: string;
    debug?: boolean;
}
export default function Editor(props: EditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { token } = theme.useToken();
    const [api, contextHolder] = notification.useNotification();

    console.log(!props.test, props.collab, props.room);

    const handleError = useCallback((err: Error) => {
        if(!props.debug) return console.log(err);
        
        api.error({
            message: "發生錯誤",
            description: <>
                <Typography.Text type="danger">{err.message}</Typography.Text>
                <Typography.Paragraph type="secondary">{err.stack}</Typography.Paragraph>
            </>,
            placement: "bottomRight",
            style: {maxHeight: "30%", overflow: "auto"}
        })
    }, [api, props.debug]);

    console.log(props.collab ? null : !props.test ? props.initialEditorState : undefined);
    return <div className={styles.editorFrame} style={{ backgroundColor: token.colorBgLayout }}>
        <LexicalComposer
            initialConfig={{
                namespace: 'Editor', theme: themes, onError: handleError, nodes: nodes,
                /** @see https://lexical.dev/docs/collaboration/react */
                editorState: props.collab ? null : !props.test ? props.initialEditorState : undefined,
            }}>
            {!props.test && !props.collab && <SavePlugin />}
            <ToolBarPlugin />
            <ToolKitPlugin />
            {
                props.test && props.collab && <CollaboratePlugin room="test" cursorsContainerRef={containerRef}
                    initialEditorState={$createEmptyForCollab} />
            }
            {
                !props.test && props.collab && props.room && <CollaboratePlugin room={props.room}
                    cursorsContainerRef={containerRef} initialEditorState={props.initialEditorState} username={props.username} />
            }
            <div id="editor-scroller" className={styles.editorScroller}>
                <div id="editor-anchor" className={styles.anchor}>
                    <RichTextPlugin placeholder={<></>} ErrorBoundary={LexicalErrorBoundary}
                        contentEditable={<ContentEditable style={{ color: token.colorText, outline: "none", cursor: "text" }} />} />
                    <DraggablePlugin items={items} />
                    <AutoFocusPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <HistoryPlugin />
                    <TabIndentationPlugin />
                    <LinkPlugin />
                    <ListMaxLevelPlugin maxLevel={5} />
                    <ListPlugin />
                    <FloatingEditorLinkPlugin />
                    <CheckListPlugin />
                    <ClearEditorPlugin />
                    <CanvasPlugin />
                    {/* <AIPlaceholderPlugin /> */}
                    <AIQuestionPlugin />
                    <CodeHighlightPlugin />
                    <CodeActionPlugin />
                    <ColumnPlugin />
                    <DocumentPlugin />
                    <ImagePlugin />
                    <TablePlugin />
                    <TableActionPlugin />
                    <TableModalPlugin />
                    <ImageToTextPlugin />
                    <TableOfContentPlugin />
                    <VideoPlugin />
                    <MathPlugin />
                </div>
            </div>
        </LexicalComposer>
        {contextHolder}
    </div>;
}