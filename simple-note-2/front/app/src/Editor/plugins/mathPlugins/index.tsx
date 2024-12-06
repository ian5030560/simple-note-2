import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {mergeRegister} from "@lexical/utils";
import { $getSelection, COMMAND_PRIORITY_LOW, KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND } from "lexical";
import { $isBlockMathNode } from "../../nodes/math/block";

export default function MathPlugin(){
    const [editor] = useLexicalComposerContext();

    useEffect(() => {

        function $handleDelete(){
            const selection = $getSelection();
            if(selection){
                const nodes = selection.getNodes();
                const filtered = nodes.filter($isBlockMathNode);
                filtered.forEach(it => it.remove());
            }
        }

        return mergeRegister(
            editor.registerCommand(KEY_BACKSPACE_COMMAND, () => {
                $handleDelete();
                return false;
            }, COMMAND_PRIORITY_LOW),
            editor.registerCommand(KEY_DELETE_COMMAND, () => {
                $handleDelete();
                return false;
            }, COMMAND_PRIORITY_LOW)
        );
    }, [editor]);

    return null;
}