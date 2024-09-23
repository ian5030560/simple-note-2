import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "..";
import { AutoFocusPlugin as LexicalAutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useAnchor } from "../../Draggable/component";
import { useEffect } from "react";

const AutoFocusPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const anchor = useAnchor();

    useEffect(() => editor.registerUpdateListener(() => {
        console.log(1);
    }), [editor]);

    return <LexicalAutoFocusPlugin />
}

export default AutoFocusPlugin;