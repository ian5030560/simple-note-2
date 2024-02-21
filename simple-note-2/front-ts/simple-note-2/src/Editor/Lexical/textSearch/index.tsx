import { $getRoot, LexicalCommand, createCommand } from "lexical";
import { Plugin } from "../Interface";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const SEARCH_TEXT: LexicalCommand<string> = createCommand();

const TextSearchPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(SEARCH_TEXT, (payload) => {
            // const keys = $getRoot().getChildrenKeys();

            // keys.forEach(key => {
            //     let blockElement = editor.getElementByKey(key)!;
            //     const regex = new RegExp(payload, "gi");
                
            //     let text = blockElement.innerHTML;
            //     text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, '');
              
            //     const newText = text.replace(regex, '<mark class="highlight">$&</mark>');
            //     blockElement.innerHTML = newText;
            // });

            return false;
        }, 4);
    }, [editor]);

    return null;
}

export default TextSearchPlugin;