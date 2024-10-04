import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AutoFocusPlugin as LexicalAutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useEffect } from "react";
import { $createParagraphNode, $getRoot, $isParagraphNode } from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";

export default function AutoFocusPlugin(){
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const inter = setInterval(() => {
            const last = editor.getEditorState().read(() => $getRoot().getLastChild());

            if(!$isParagraphNode(last) && !$isHeadingNode(last)){
                editor.update(() => last?.insertAfter($createParagraphNode()));
            }
        }, 100);

        return () => clearInterval(inter);
    }, [editor]);

    return <LexicalAutoFocusPlugin />
}