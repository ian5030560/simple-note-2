import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { theme } from "antd";
import { $getSelection, $isRangeSelection, ElementNode, LexicalNode, $createParagraphNode, KEY_ARROW_DOWN_COMMAND, KEY_ARROW_RIGHT_COMMAND, KEY_ARROW_UP_COMMAND, KEY_ARROW_LEFT_COMMAND } from "lexical";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { useEffect } from "react";
import ColumnContainerNode, { $isColumnContainerNode } from "../../nodes/column/container";
import ColumnItemNode, { $isColumnItemNode } from "../../nodes/column/item";
import { useValidateNodeClasses } from "../../utils";

export default function ColumnPlugin(){

    const [editor] = useLexicalComposerContext();
    const { token } = theme.useToken();

    useValidateNodeClasses([ColumnContainerNode, ColumnItemNode]);

    const $onEscape = (before: boolean) => {
        const selection = $getSelection();
        if (
            $isRangeSelection(selection) &&
            selection.isCollapsed() &&
            selection.anchor.offset === 0
        ) {
            const container = $findMatchingParent(
                selection.anchor.getNode(),
                $isColumnContainerNode,
            );

            if ($isColumnContainerNode(container)) {
                const parent = container.getParent<ElementNode>();
                const child =
                    parent &&
                    (before
                        ? parent.getFirstChild<LexicalNode>()
                        : parent?.getLastChild<LexicalNode>());
                const descendant = before
                    ? container.getFirstDescendant<LexicalNode>()?.getKey()
                    : container.getLastDescendant<LexicalNode>()?.getKey();

                if (
                    parent !== null &&
                    child === container &&
                    selection.anchor.key === descendant
                ) {
                    if (before) {
                        container.insertBefore($createParagraphNode());
                    } else {
                        container.insertAfter($createParagraphNode());
                    }
                }
            }
        }

        return false;
    };


    useEffect(() => {

        return mergeRegister(

            editor.registerCommand(KEY_ARROW_DOWN_COMMAND, () => $onEscape(false), 1),
            editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, () => $onEscape(false), 1),
            editor.registerCommand(KEY_ARROW_UP_COMMAND, () => $onEscape(true), 1),
            editor.registerCommand(KEY_ARROW_LEFT_COMMAND, () => $onEscape(true), 1),
            editor.registerNodeTransform(ColumnItemNode, (node) => {
                const parent = node.getParent<ElementNode>();
                if (!$isColumnContainerNode(parent)) {
                    const children = node.getChildren<LexicalNode>();
                    for (const child of children) {
                        node.insertBefore(child);
                    }
                    node.remove();
                }
            }),
            editor.registerNodeTransform(ColumnContainerNode, (node) => {
                const children = node.getChildren<LexicalNode>();
                if (!children.every($isColumnItemNode)) {
                    for (const child of children) {
                        node.insertBefore(child);
                    }
                    node.remove();
                }
            }),
            // editor.registerCommand(APPEND_COLUMNS, (payload) => {
            //     editor.update(() => {
            //         const selection = $getSelection();
            //         if ($isRangeSelection(selection)) {
            //             let node: LexicalNode | null = selection.anchor.getNode();
            //             if (!$isColumnItemNode(node)) {
            //                 node = $findMatchingParent(node, $isColumnItemNode);
            //             }
            //             if ($isColumnItemNode(node)) {
            //                 const pnode = $findMatchingParent(node, $isColumnContainerNode);
            //                 if ($isColumnContainerNode(pnode)) {
            //                     pnode.setNumber(pnode.getChildrenSize() + payload);
            //                     for (let i = 0; i < payload; i++) {
            //                         node.insertAfter($createColumnItemNode().append($createParagraphNode()));
            //                     }
            //                 }
            //             }
            //         }
            //     })
            //     return false;
            // }, 4),
        )
    }, [editor, token.colorText]);

    return null;
}