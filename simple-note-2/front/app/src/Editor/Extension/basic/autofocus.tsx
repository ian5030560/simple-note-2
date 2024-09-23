import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "..";
import { AutoFocusPlugin as LexicalAutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useEffect } from "react";
import { $getRoot, $isParagraphNode } from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";

const AutoFocusPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => editor.registerUpdateListener(() => {
        editor.update(() => {
            const last = $getRoot().getLastChild();
            if (!$isParagraphNode(last) && !$isHeadingNode(last)) {
                last?.selectEnd().insertParagraph();
            }
        });
    }), [editor]);

    return <LexicalAutoFocusPlugin />
}

export default AutoFocusPlugin;