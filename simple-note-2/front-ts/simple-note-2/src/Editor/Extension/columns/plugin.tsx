import { $createParagraphNode, $getSelection, $isRangeSelection, ElementNode, KEY_ARROW_DOWN_COMMAND, KEY_ARROW_LEFT_COMMAND, KEY_ARROW_RIGHT_COMMAND, KEY_ARROW_UP_COMMAND, LexicalCommand, LexicalNode, createCommand } from "lexical";
import { Plugin } from "..";
import Modal from "../UI/modal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Flex, InputNumber, theme } from "antd";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $createColumnContainerNode, $isColumnContainerNode, ColumnContainerNode } from "./container";
import { $createColumnItemNode, $isColumnItemNode, ColumnItemNode } from "./item";
import { $insertNodeToNearestRoot, $findMatchingParent } from "@lexical/utils";
import ColumnAction from "./action";

export const INSERT_COLUMNS: LexicalCommand<number> = createCommand();
export const OPEN_COLUMN_MODAL: LexicalCommand<void> = createCommand();
export const APPEND_COLUMNS: LexicalCommand<number> = createCommand();
const ColumnLayoutModal = () => {
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [editor] = useLexicalComposerContext();

    const handleOk = useCallback(() => {
        let value = inputRef.current?.value;
        if (value) {
            editor.dispatchCommand(INSERT_COLUMNS, parseInt(value));
        }
        setOpen(false);
    }, [editor]);

    const footer = useMemo(() => {
        return <Flex gap={"small"} dir="rtl">
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleOk}>確認</Button>
        </Flex>;
    }, [handleOk]);

    return <Modal command={OPEN_COLUMN_MODAL} open={open} title="插入欄位" width={300}
        onOpen={() => setOpen(true)} onClose={() => setOpen(false)} footer={footer}>
        <InputNumber min={1} max={10} size="large" ref={inputRef} style={{ width: "100%" }} defaultValue={3} />
    </Modal>;
}

const ColumnLayoutPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();
    const { token } = theme.useToken();

    const onEscape = (before: boolean) => {
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
            editor.registerCommand(INSERT_COLUMNS, (payload) => {
                editor.update(() => {
                    const container = $createColumnContainerNode(payload);
                    for (let i = 0; i < payload; i++) {
                        container.append($createColumnItemNode().append($createParagraphNode()))
                    }

                    $insertNodeToNearestRoot(container);
                    container.selectStart();
                })
                return true;
            }, 4),

            editor.registerCommand(KEY_ARROW_DOWN_COMMAND, () => onEscape(false), 1),
            editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, () => onEscape(false), 1),
            editor.registerCommand(KEY_ARROW_UP_COMMAND, () => onEscape(true), 1),
            editor.registerCommand(KEY_ARROW_LEFT_COMMAND, () => onEscape(true), 1),
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
            editor.registerMutationListener(ColumnItemNode, (mutations) => {
                Array.from(mutations).forEach(mutation => {
                    if (mutation[1] === "updated" || mutation[1] === "created") {
                        editor.getElementByKey(mutation[0])!.style.border = `1px solid ${token.colorText}`
                    }
                })
            }),
            editor.registerCommand(APPEND_COLUMNS, (payload) => {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        let node: LexicalNode | null = selection.anchor.getNode();
                        if (!$isColumnItemNode(node)) {
                            node = $findMatchingParent(node, $isColumnItemNode);
                        }
                        if ($isColumnItemNode(node)) {
                            let pnode = $findMatchingParent(node, $isColumnContainerNode);
                            if ($isColumnContainerNode(pnode)) {
                                pnode.setNumber(pnode.getChildrenSize() + payload);
                                for (let i = 0; i < payload; i++) {
                                    node.insertAfter($createColumnItemNode().append($createParagraphNode()));
                                }
                            }
                        }
                    }
                })
                return false;
            }, 4),
        )
    }, [editor, token.colorText]);

    return <>
        <ColumnLayoutModal />
        <ColumnAction />
    </>;
}

export default ColumnLayoutPlugin;