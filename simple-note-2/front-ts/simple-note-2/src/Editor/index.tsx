import React, { useState } from "react";
import { EditorThemeClasses, EditorState } from 'lexical';
import { useEffect } from 'react';
import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer';
// import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import "./index.css";
import ToolBar from "./ToolBar";
import { theme } from "antd";

function onError(error: Error) {
    console.error(error);
}

type ChangeListener = (editorState: EditorState) => void;

function OnChangePlugin({ onChange }: { onChange: ChangeListener }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
            onChange(editorState);
        });
    }, [editor, onChange]);
    return null;
}

const editorTheme: EditorThemeClasses = {
    ltr: 'ltr',
    rtl: 'rtl',
    paragraph: 'editor-paragraph',
    text: {
        bold: "text-bold",
    }
};

const Editor: React.FC = () => {

    const [, setEditorState] = useState<EditorState>();
    const { token } = theme.useToken();

    const initialConfig: InitialConfigType = {
        namespace: 'Editor',
        theme: editorTheme,
        onError,
    };

    function onChange(editorState: EditorState) {
        setEditorState(editorState);
        console.log(editorState);
    }

    return <>
        <ToolBar />
        <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
                contentEditable={<ContentEditable className="editable" style={{color: token.colorText}}/>}
                placeholder={<></>}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <OnChangePlugin onChange={onChange} />
        </LexicalComposer>
    </>
}

export default Editor;