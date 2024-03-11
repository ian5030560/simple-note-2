import { LexicalEditor } from "lexical";
import { Plugin } from "../..";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { useCallback } from "react";

var editorInstance: LexicalEditor | null;

export function getEditorInstance(): Readonly<LexicalEditor | null> {
    return editorInstance;
}

const EditorInstancePlugin: Plugin = () => {
    const getInstance = useCallback((editor: LexicalEditor | null) => editorInstance = editor, []);
    return <EditorRefPlugin editorRef={getInstance}/>
}

export default EditorInstancePlugin;