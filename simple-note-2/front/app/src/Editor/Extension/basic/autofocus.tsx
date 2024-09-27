import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "..";
import { AutoFocusPlugin as LexicalAutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useEffect } from "react";
import { $createParagraphNode, $getRoot, $isParagraphNode } from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";

const AutoFocusPlugin: Plugin = () => {
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

export default AutoFocusPlugin;