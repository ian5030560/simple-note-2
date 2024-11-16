import { Button, Dropdown, MenuProps } from "antd";
import { $findMatchingParent } from "@lexical/utils";
import Action, { WithAnchorProps } from "../../ui/action";
import { useEffect, useMemo, useRef, useState } from "react";
import { $createParagraphNode, $getNodeByKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { inside } from "../../utils";
import ColumnItemNode, { $createColumnItemNode, $isColumnItemNode } from "../../nodes/column/item";
import { $isColumnContainerNode } from "../../nodes/column/container";
import { PencilSquare } from "react-bootstrap-icons";

type ColumnActionPluginProps = WithAnchorProps;
export default function ColumnActionPlugin(props: ColumnActionPluginProps){
    const [editor] = useLexicalComposerContext();
    const [key, setKey] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => editor.registerMutationListener(ColumnItemNode, (mutations) => {
        Array.from(mutations).forEach(([key, tag]) => {
            if (tag === "updated") return;

            const element = editor.getElementByKey(key);
            if (!element) return;

            element.addEventListener("mouseenter", () => {
                setOpen(true);
                setKey(key);
            });

            element.addEventListener("mouseleave", (e) => {
                const { clientX: x, clientY: y } = e;
                // const addButton = addButtonRef.current;
                // const removeButton = removeButtonRef.current;
                // if (addButton && removeButton && (inside(x, y, addButton) || inside(x, y, removeButton))) return;
                setOpen(false);
                setKey(null);
            });
        });
    }), [editor]);

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
                        if(size === 0){
                            parent.remove();
                        }
                        else{
                            parent.setNumber(parent.getChildrenSize() - 1);
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

    return <Action placement={["top", "right"]} open={open} nodeKey={key} anchor={props.anchor}>
        <Dropdown trigger={["click"]} menu={{ items: items }} placement="bottom" autoAdjustOverflow>
            <Button type="text" icon={<PencilSquare size={16} />} />
        </Dropdown>
    </Action>
}