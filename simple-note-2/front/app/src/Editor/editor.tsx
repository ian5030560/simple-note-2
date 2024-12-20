import { useRef, useState } from "react";
import SavePlugin from "./plugins/savePlugin";
import { InitialEditorStateType, LexicalComposer } from "@lexical/react/LexicalComposer";
import ToolBarPlugin from "./plugins/toolbarPlugin";
import ToolKitPlugin from "./plugins/toolkitPlugin";
import DraggablePlugin from "./plugins/draggablePlugin";
import CollaboratePlugin from "./plugins/collaboratePlugin";
import { $createParagraphNode, $getRoot, EditorState, LexicalEditor, LexicalNode } from "lexical";
import styles from "./editor.module.css";
import { theme } from "antd";
import themes from "./themes";
import nodes from "./nodes";
import RichTextPlugin from "./plugins/richTextPlugin";
import AutoFocusPlugin from "./plugins/autoFocusPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import ListMaxLevelPlugin from "./plugins/listPlugins/maxLevel";
import LinkPlugin from "./plugins/linkPlugins";
import FloatingEditorLinkPlugin from "./plugins/linkPlugins/floatingLinkEditor";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { TRANSFORMERS } from '@lexical/markdown';
import CanvasPlugin from "./plugins/canvasPlugin";
import AIPlaceholderPlugin from "./plugins/AIPlugins/placeholder";
import AIQuestionPlugin from "./plugins/AIPlugins/question";
import CodeHighlightPlugin from "./plugins/codePlugins/highlight";
import CodeActionPlugin from "./plugins/codePlugins/action";
import ColumnPlugin from "./plugins/columnPlugins";
import DocumentModalPlugin from "./plugins/documentModalPlugin";
import ImageModalPlugin from "./plugins/imageModalPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import TableActionPlugin from "./plugins/tablePlugins/action";
import TableModalPlugin from "./plugins/tablePlugins/modal";
import ImageToTextPlugin from "./plugins/imageToTextPlugin";
import VideoModalPlugin from "./plugins/videoModalPlugin";
import items from "./items";
import TableOfContentPlugin from "./plugins/tableOfContentPlugin";
import MathModalPlugin from "./plugins/mathModalPlugin";
import ErrorPlugin from "./plugins/errorPlugin";
import ColumnActionPlugin from "./plugins/columnPlugins/action";
import ColumnModalPlugin from "./plugins/columnPlugins/modal";
import mergeRefs from "merge-refs";
import ListPlugin from "./plugins/listPlugins";

function $createEmptyContent() {
    const root = $getRoot();
    console.log(1);
    if (root.isEmpty()) {
        const p = $createParagraphNode();
        root.append(p);
        p.select();
    }
}
async function readFileToDataURL(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
    });
}

const dummyFn = () => { };

function $validateEditorState(editor: LexicalEditor, editorState: InitialEditorStateType) {
    if (typeof editorState === "function") return editorState(editor);
    else if (typeof editorState === "string") {
        const parsed = editor.parseEditorState(editorState);
        if (parsed.isEmpty()) {
            editor.update(() => $createEmptyContent());
        }
        else {
            editor.setEditorState(parsed);
        }
    }
    else if(typeof editorState === "object"){
        if (editorState!.isEmpty()) {
            editor.update(() => $createEmptyContent());
        }
        else if(editorState !== null){
            editor.setEditorState(editorState);
        }
    }
}
interface EditorProps {
    test?: boolean;
    collab?: boolean;
    initialEditorState?: InitialEditorStateType;
    room?: string;
    username?: string;
    insertFile?: (file: File) => string | Promise<string>;
    destroyFile?: (node: LexicalNode) => void;
    onSave?: (editorState: EditorState) => void;
    onError?: (err: Error, editor: LexicalEditor) => void;
    editable?: boolean;
}
export default function Editor(props: EditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { token } = theme.useToken();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [overlayContainer, setOverlayContainer] = useState<HTMLElement | null>(null);

    return <div className={styles.editorFrame} style={{ backgroundColor: token.colorBgLayout }}>
        <LexicalComposer
            initialConfig={{
                namespace: 'Editor', theme: themes, nodes: nodes, editable: props.editable,
                onError: props.onError || dummyFn,
                /** @see https://lexical.dev/docs/collaboration/react */
                editorState: props.collab ? null : !props.test ?
                    !props.initialEditorState ? $createEmptyContent :
                        (editor) => $validateEditorState(editor, props.initialEditorState!) : undefined,
            }}>
            {!props.test && !props.collab && <SavePlugin onSave={props.onSave || dummyFn} />}
            <ToolBarPlugin />
            <ToolKitPlugin />
            <ErrorPlugin whenRaiseError={props.onError || dummyFn} />
            {
                props.test && props.collab && <CollaboratePlugin room="test" cursorsContainerRef={containerRef}
                    initialEditorState={$createEmptyContent} />
            }
            {
                !props.test && props.collab && props.room && <CollaboratePlugin room={props.room}
                    cursorsContainerRef={containerRef} initialEditorState={props.initialEditorState} username={props.username} />
            }
            <div id="editor-scroller" className={styles.editorScroller}>
                <div id="editor-anchor" className={styles.anchor} ref={mergeRefs(containerRef, (node) => setAnchor(node))}>
                    <RichTextPlugin rootClassName={styles.editorRoot} />
                    <DraggablePlugin items={items} anchor={anchor} overlayContainer={overlayContainer} />
                    <AutoFocusPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    {!props.collab && <HistoryPlugin />}
                    <TabIndentationPlugin />
                    <LinkPlugin />
                    <ListMaxLevelPlugin maxLevel={5} />
                    <ListPlugin />
                    <FloatingEditorLinkPlugin anchor={anchor} />
                    <CheckListPlugin />
                    <ClearEditorPlugin />
                    <CanvasPlugin />
                    <AIPlaceholderPlugin />
                    <AIQuestionPlugin />
                    <CodeHighlightPlugin />
                    <CodeActionPlugin anchor={anchor} />
                    <ColumnPlugin />
                    <ColumnActionPlugin anchor={anchor} />
                    <ColumnModalPlugin />
                    <DocumentModalPlugin insertFile={props.insertFile || readFileToDataURL} destroyFile={props.destroyFile || dummyFn} />
                    <ImageModalPlugin insertFile={props.insertFile || readFileToDataURL} destroyFile={props.destroyFile || dummyFn} />
                    <TablePlugin />
                    <TableActionPlugin anchor={anchor} />
                    <TableModalPlugin />
                    <ImageToTextPlugin />
                    <TableOfContentPlugin />
                    <VideoModalPlugin insertFile={props.insertFile || readFileToDataURL} destroyFile={props.destroyFile || dummyFn} />
                    <MathModalPlugin />
                </div>
            </div>
        </LexicalComposer>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} ref={(node) => setOverlayContainer(node)} />
    </div>;
}