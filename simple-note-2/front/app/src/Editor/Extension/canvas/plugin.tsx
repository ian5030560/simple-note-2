import { Plugin } from "../index";
import { $getRoot, $getSelection, $isRangeSelection, $isRootNode, COMMAND_PRIORITY_EDITOR, LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createCanvasNode } from "./node";
import { useEffect } from "react";

export const INSERT_CANVAS: LexicalCommand<void> = createCommand();
const CanvasPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    
    useEffect(() => {
        editor.registerCommand(INSERT_CANVAS, () => {
            
            const selection = $getSelection();
            const node = $createCanvasNode();
            
            if ($isRangeSelection(selection)) {
                if ($isRootNode(selection.anchor.getNode())) {
                    selection.insertParagraph();
                }
                selection.insertNodes([node]);
            }
            else {
                $getRoot().selectEnd().insertNodes([node]);
            }
            return true;
        }, COMMAND_PRIORITY_EDITOR)
    }, [editor]);

    return null;
}

export default CanvasPlugin;