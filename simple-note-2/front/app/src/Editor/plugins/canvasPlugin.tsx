import { $getNodeByKey, COMMAND_PRIORITY_EDITOR, LexicalCommand, NodeKey, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $createCanvasNode } from "../nodes/canvas";
import { $insertNodeToNearestRoot } from "@lexical/utils";

export const INSERT_CANVAS: LexicalCommand<NodeKey> = createCommand();
export default function CanvasPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.registerCommand(INSERT_CANVAS, (key) => {
            const canvas = $createCanvasNode();
            const node = $getNodeByKey(key);

            if (node) {
                node?.insertAfter(canvas);
            }
            else {
                $insertNodeToNearestRoot(canvas);
            }
            return true;
        }, COMMAND_PRIORITY_EDITOR)
    }, [editor]);

    return null;
}