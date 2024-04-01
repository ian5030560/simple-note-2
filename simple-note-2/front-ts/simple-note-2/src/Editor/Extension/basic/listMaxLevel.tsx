import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "../index";
import { useCallback, useEffect } from "react";
import { $getNodeByKey, $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, INDENT_CONTENT_COMMAND, LexicalNode } from "lexical";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { $isListNode, $getListDepth, ListNode, ListItemNode, $isListItemNode } from "@lexical/list";

function getItemDepth(node: ListItemNode): number {
    let p = node;
    let n = 0;
    while (!$isListNode(p)) {
        if (!p.getParent()) {
            break;
        }
        p = p.getParent()!;
        n++;
    }
    return n;
}
const ListMaxLevelPlugin: Plugin<{ maxLevel: number }> = ({ maxLevel }) => {
    const [editor] = useLexicalComposerContext();

    const isPermitted = useCallback(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) return false;

        const node = selection.anchor.getNode();
        const parent = $findMatchingParent(node, (p) => $isListNode(p)) as ListNode | null;
        if (!parent) return false;
        let plevel = $getListDepth(parent);
        return plevel < maxLevel;
    }, [maxLevel]);

    useEffect(() => {
        function handleClick(node: LexicalNode | null) {
            editor.update(() => {
                // if (!e.target) return;
                if ($isListItemNode(node)) {
                    // let element = editor.getElementByKey(node.getKey())!;
                    // let { x } = element.getBoundingClientRect();

                    // let bWidth = 20;

                    // console.log(e.clientX > x - bWidth && e.clientX < x);
                    // if (e.clientX > x - bWidth && e.clientX < x) {
                        
                    // }
                    node.setChecked(!node.getChecked())
                }
            });
        }

        mergeRegister(
            editor.registerCommand(INDENT_CONTENT_COMMAND, () => !isPermitted(), COMMAND_PRIORITY_CRITICAL),
            editor.registerMutationListener(ListItemNode, (mutations) => {
                Array.from(mutations).forEach(([key, tag]) => {
                    let element = editor.getElementByKey(key);

                    editor.update(() => {
                        let node = $getNodeByKey(key)!;
                        let pNode = $findMatchingParent(node, $isListNode);
                        if ($isListNode(pNode) && pNode.getListType() === "check") {
                            const click = () => handleClick(node);
                            if (tag === "created") {
                                element?.addEventListener("click", click);
                            }
                            if (tag === "destroyed") {
                                element?.removeEventListener("click", click);
                            }
                        }
                    })
                });
            }),
        )
    }, [editor, isPermitted]);

    return null;
}

export default ListMaxLevelPlugin;