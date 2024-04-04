import { useEffect } from "react";
import { Plugin } from "..";
import { $getSelection, $isRangeSelection, LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapSelectionInMarkNode, MarkNode, $createMarkNode } from "@lexical/mark";
import getRandomString from "../../../util/random";
import { CommentLane } from "./component";
import { mergeRegister, registerNestedElementResolver } from "@lexical/utils";

export const INSERT_COMMENT: LexicalCommand<void> = createCommand();
const CommentPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(INSERT_COMMENT, () => {
                let selection = $getSelection();
                if ($isRangeSelection(selection) && !selection.isCollapsed()) {
                    $wrapSelectionInMarkNode(selection, selection.isBackward(), getRandomString(10));
                }
                return false;
            }, 1),
            editor.registerUpdateListener(() => {

            }),
            // registerNestedElementResolver<MarkNode>(editor, MarkNode,
            //     (from: MarkNode) => $createMarkNode(from.getIDs()),
            //     () => {

            //     }
            // )
        )
    }, [editor]);

    return <CommentLane />;
}

export default CommentPlugin;