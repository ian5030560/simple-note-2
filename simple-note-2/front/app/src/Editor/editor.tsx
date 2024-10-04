import { useRef } from "react";
import SavePlugin, { InitialNoteType } from "./plugins/savePlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import ToolBarPlugin from "./plugins/toolbarPlugin";
import ToolKitPlugin from "./plugins/toolkitPlugin";
import DraggablePlugin from "./plugins/draggablePlugin";
import CollaboratePlugin from "./plugins/collaboratePlugin";
import { $createParagraphNode, $getRoot } from "lexical";
import styles from "./editor.module.css";
import { theme } from "antd";
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
import PlaceholderPlugin from "./plugins/placeholderPlugin";
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

function onError(error: Error) {
    console.error(error);
}

interface InnerEditorProps {
    test?: boolean;
    collab?: boolean;
    initialNote?: InitialNoteType;
    room?: string;
}
export default function Editor({ test, collab, initialNote, room }: InnerEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { token } = theme.useToken();

    return <LexicalComposer
        initialConfig={{
            namespace: 'Editor', theme: themes, onError, nodes: nodes,
            /** @see https://lexical.dev/docs/collaboration/react */
            editorState: collab ? null : undefined,
        }}>
        {!test && !collab && <SavePlugin initialNote={initialNote} />}
        <ToolBarPlugin />
        <ToolKitPlugin />
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
                <PlaceholderPlugin />
                <ClearEditorPlugin />
                <CanvasPlugin />
                {/* <AIPlaceholderPlugin/> */}
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
                <TableOfContentPlugin/>
                <VideoPlugin />
            </div>
        </div>
    </LexicalComposer>;
}