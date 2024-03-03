import { $getSelection, $isRangeSelection, $isRootNode, COMMAND_PRIORITY_EDITOR, LexicalCommand, createCommand } from "lexical";
import { Plugin } from "../index";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createImageNode } from "./node";
import ImageModal from "./modal";

export const INSERT_IMAGE: LexicalCommand<{alt: string, src: string}> = createCommand();

const ImagePlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(INSERT_IMAGE, (payload) => {

            editor.update(() => {
                const selection = $getSelection();
                if($isRangeSelection(selection)){
                    if($isRootNode(selection.anchor.getNode())){
                        selection.insertParagraph();
                    }
                    const node = $createImageNode(payload.src, payload.src);
                    selection.insertNodes([node]);
                }
            });

            return true;
        }, COMMAND_PRIORITY_EDITOR)
    }, [editor]);

    return <ImageModal/>;
}

export default ImagePlugin;