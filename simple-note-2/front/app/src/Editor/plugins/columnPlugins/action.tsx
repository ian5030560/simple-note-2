import { Button, Dropdown, MenuProps } from "antd";
import { $findMatchingParent } from "@lexical/utils";
import Action, { WithAnchorProps } from "../../ui/action";
import { useEffect, useMemo, useState } from "react";
import { $cloneWithProperties, $createParagraphNode, $getNodeByKey, $getRoot, $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createColumnItemNode, $isColumnItemNode } from "../../nodes/column/item";
import { $isColumnContainerNode } from "../../nodes/column/container";
import { PencilSquare } from "../../../util/icons";

type ColumnActionPluginProps = WithAnchorProps;
export default function ColumnActionPlugin(props: ColumnActionPluginProps){
    const [editor] = useLexicalComposerContext();
    const [key, setKey] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
        const selection = $getSelection();
        if($isRangeSelection(selection)){
            const node = selection.anchor.getNode();
            const parent = $isColumnItemNode(node) ? node : $findMatchingParent(node, $isColumnItemNode);
            if(parent){
                setKey(parent.getKey());
                setOpen(true);
                return false;
            }
        }
        setKey(null);
        setOpen(false);

        return false;
    }, 4), [editor, open]);

    const node = useMemo(() => key ? editor.read(() => $getNodeByKey(key)) : null, [editor, key]);

    const items: MenuProps["items"] = useMemo(() => [
        {
            key: "addLeft",
            label: "往左增加一欄",
            onClick: () => editor.update(() => {
                if ($isColumnItemNode(node)) {
                    const parent = $findMatchingParent(node, p => $isColumnContainerNode(p));
                    if ($isColumnContainerNode(parent)) {
                        parent.setNumber(parent.getChildrenSize() + 1);
                        node.insertBefore($createColumnItemNode().append($createParagraphNode()));
                    }
                }
            })
        },
        {
            key: "addRight",
            label: "往右增加一欄",
            onClick: () => editor.update(() => {
                if ($isColumnItemNode(node)) {
                    const parent = $findMatchingParent(node, p => $isColumnContainerNode(p));
                    if ($isColumnContainerNode(parent)) {
                        parent.setNumber(parent.getChildrenSize() + 1);
                        node.insertAfter($createColumnItemNode().append($createParagraphNode()));
                    }
                }
            })
        },
        {
            key: "divider",
            label: <hr />,
            disabled: true,
        },
        {
            key: "removeSelf",
            label: "刪除此欄",
            onClick: () => editor.update(() => {
                if ($isColumnItemNode(node)) {
                    const parent = $findMatchingParent(node, $isColumnContainerNode);
                    if ($isColumnContainerNode(parent)) {
                        node.remove();
                        const size = parent.getChildrenSize();
                        if(size === 1){
                            const clones = parent.getChildren().map($cloneWithProperties);
                            if(parent.isLastChild()){
                                parent.remove();
                                $getRoot().append(...clones);
                            }
                            else{
                                if(parent.getPreviousSibling()){
                                    clones.forEach(clone => parent.getPreviousSibling()?.insertAfter(clone));
                                }
                                else{
                                    clones.forEach(clone => parent.getNextSibling()?.insertBefore(clone));
                                }
                            }
                        }
                        else{
                            parent.setNumber(parent.getChildrenSize());
                        }
                    }
                }
            })
        },
        {
            key: "removeAll",
            label: "刪除全部",
            onClick: () => editor.update(() => {
                if ($isColumnItemNode(node)) {
                    const parent = $findMatchingParent(node, $isColumnContainerNode);
                    if ($isColumnContainerNode(parent)) {
                        parent.remove();
                    }
                }
            }),
            danger: true,
        },
    ], [editor, node]);

    return <Action placement={"top-end"} inner open={open} nodeKey={key} anchor={props.anchor}>
        <Dropdown trigger={["click"]} menu={{ items: items }} placement="bottom" autoAdjustOverflow>
            <Button type="text" icon={<PencilSquare />} />
        </Dropdown>
    </Action>
}