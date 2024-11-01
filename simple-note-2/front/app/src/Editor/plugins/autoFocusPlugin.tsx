import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AutoFocusPlugin as LexicalAutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useCallback } from "react";
import { $createParagraphNode, $getRoot, $isParagraphNode } from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";

export default function AutoFocusPlugin(){
    const [editor] = useLexicalComposerContext();

    const handleClick = useCallback(() => {
        const last = editor.getEditorState().read(() => $getRoot().getLastChild());

        if(!$isParagraphNode(last) && !$isHeadingNode(last)){
            editor.update(() => last?.insertAfter($createParagraphNode()));
        }
    }, [editor]);

    return <>
        <LexicalAutoFocusPlugin />
        <div style={{height: "20%", width: "100%"}} onClick={handleClick}></div>
    </>
}