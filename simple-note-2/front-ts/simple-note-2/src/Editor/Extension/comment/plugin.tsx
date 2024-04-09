import { useEffect } from "react";
import { Plugin } from "..";
import { $getSelection, $isRangeSelection, $isTextNode, LexicalCommand, SELECTION_CHANGE_COMMAND, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapSelectionInMarkNode, $getMarkIDs, MarkNode, $createMarkNode } from "@lexical/mark";
import getRandomString from "../../../util/random";
import { CommentPool } from "./component";
import { mergeRegister, registerNestedElementResolver } from "@lexical/utils";

export const INSERT_COMMENT: LexicalCommand<void> = createCommand();
const CommentPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => { wfewef
        return mergeRegister(
            editor.registerCommand(INSERT_COMMENT, () => {
                let selection = $getSelection();
                if ($isRangeSelection(selection) && !selection.isCollapsed()) {
                    $wrapSelectionInMarkNode(selection, selection.isBackward(), getRandomString(10));
                }
                return false;
            }, 1),
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                editor.update(() => {
                    let selection = $getSelection();
                    if($isRangeSelection(selection)){
                        let node = selection.anchor.getNode();
                        if($isTextNode(node)){
                            let id = $getMarkIDs(node, selection.anchor.offset);
                            
                        }
                    }
                })
                return false;
            }, 1),
            
            registerNestedElementResolver<MarkNode>(editor, MarkNode,
                (from: MarkNode) => $createMarkNode(from.getIDs()),
                (from: MarkNode, to: MarkNode) => {
                    const ids = from.getIDs();
                    ids.forEach((id) => to.addID(id));
                }
            ),

            editor.registerMutationListener(MarkNode, (mutations) => {
                Array.from(mutations).forEach(([key, tag]) => {
                    if(tag === "destroyed"){
                        b
                    }
                })
            })
        )
    }, [editor]);

    return <CommentPool />;
}

export default CommentPlugin;