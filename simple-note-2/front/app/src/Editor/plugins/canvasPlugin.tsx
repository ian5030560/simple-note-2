import { $getRoot, $getSelection, $isRangeSelection, $isRootNode, COMMAND_PRIORITY_EDITOR, LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $createCanvasNode } from "../nodes/canvas";

export const INSERT_CANVAS: LexicalCommand<void> = createCommand();
export default function CanvasPlugin(){
    const [editor] = useLexicalComposerContext();
    
    useEffect(() => {
        editor.registerCommand(INSERT_CANVAS, () => {
            
            const selection = $getSelection();
            const node = $createCanvasNode();
            
            if ($isRangeSelection(selection)) {
                if ($isRootNode(selection.anchor.getNode())) {
                    selection.insertParagraph();
                }
                console.log(selection.getNodes());
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