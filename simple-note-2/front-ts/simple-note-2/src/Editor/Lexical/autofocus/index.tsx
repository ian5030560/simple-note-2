import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "../Interface";
import { useEffect } from "react";

const AutofocusPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => editor.focus(), [editor]);
    return null;
}
export default AutofocusPlugin;