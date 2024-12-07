import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect } from "react";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, INDENT_CONTENT_COMMAND } from "lexical";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { $isListNode, $getListDepth, ListNode } from "@lexical/list";

interface ListMaxLevelPluginProps{
    maxLevel: number;
}
export default function ListMaxLevelPlugin(props: ListMaxLevelPluginProps){
    const [editor] = useLexicalComposerContext();

    const $isPermitted = useCallback(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        const node = selection.anchor.getNode();
        const parent = $findMatchingParent(node, $isListNode) as ListNode | null;
        if (!parent) return false;
        const plevel = $getListDepth(parent);
        console.log(plevel);
        return plevel < props.maxLevel;
    }, [props.maxLevel]);

    useEffect(() => {
        mergeRegister(
            editor.registerCommand(INDENT_CONTENT_COMMAND, () => !$isPermitted(), COMMAND_PRIORITY_CRITICAL),
        )
    }, [editor, $isPermitted]);

    return null;
}