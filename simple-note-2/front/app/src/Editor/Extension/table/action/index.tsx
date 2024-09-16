import { CiCircleChevDown } from "react-icons/ci";
import { Plugin } from "../../index";
import { Button, Dropdown, MenuProps } from "antd";
import { cloneElement, useEffect, useMemo, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $isTableSelection, $getTableCellNodeFromLexicalNode,
    $insertTableColumn__EXPERIMENTAL, $insertTableRow__EXPERIMENTAL,
    $deleteTableColumn__EXPERIMENTAL, $deleteTableRow__EXPERIMENTAL,
    TableCellNode, $isTableNode,
} from "@lexical/table";
import { $getSelection, $isRangeSelection, NodeKey, SELECTION_CHANGE_COMMAND } from "lexical";
import styles from "./action.module.css";
import Action from "../../UI/action";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";

const TableActionPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const [key, setKey] = useState<NodeKey>();

    useEffect(() => mergeRegister(
        editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            const selection = $getSelection();
            if (!($isRangeSelection(selection) || $isTableSelection(selection))) {
                setOpen(false);
                setKey(undefined);
            }
            else {
                const node = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                setKey(node?.getKey());
                setOpen(true);
            };
            return false;
        }, 4),
    ), [editor]);

    const items: MenuProps["items"] = useMemo(() => {
        return [
            {
                key: "addRowAbove",
                label: "往上增加一列",
                onClick: () => editor.update(() => $insertTableRow__EXPERIMENTAL(false)),
            },
            {
                key: "addRowBelow",
                label: "往下增加一列",
                onClick: () => editor.update(() => $insertTableRow__EXPERIMENTAL(true)),
            },
            {
                key: "addColumnLeft",
                label: "往左增加一欄",
                onClick: () => editor.update(() => $insertTableColumn__EXPERIMENTAL(false)),
            },
            {
                key: "addColumnRight",
                label: "往右增加一欄",
                onClick: () => editor.update(() => $insertTableColumn__EXPERIMENTAL(true)),
            },
            {
                key: "divider",
                label: <hr />,
                disabled: true,
            },
            {
                key: "deleteRow",
                label: "刪除該列",
                onClick: () => editor.update(() => $deleteTableRow__EXPERIMENTAL()),
            },
            {
                key: "deleteColumn",
                label: "刪除該欄",
                onClick: () => editor.update(() => $deleteTableColumn__EXPERIMENTAL()),
            },
            {
                key: "deleteAll",
                label: "刪除表格",
                onClick: () => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
                            const node = selection.anchor.getNode();
                            const tableNode = $findMatchingParent(node, $isTableNode);
                            if ($isTableNode(tableNode)) {
                                tableNode.remove();
                            }
                        }
                    })
                },
                danger: true,
            }
        ]
    }, [editor]);

    return key ? <Action nodeKey={key} open={open} placement={["top", "right"]}>
        <div className="simple-note-2-table-cell-action-button-container">
            <Dropdown menu={{ items }} trigger={["click"]} placement="bottom" autoAdjustOverflow
                dropdownRender={(node) => cloneElement(node as React.JSX.Element, { className: styles.dropDown })}>
                <Button type="text" className="simple-note-2-table-cell-action-button"
                    icon={<CiCircleChevDown size={20} />} />
            </Dropdown>
        </div>
    </Action> : null;
}

export default TableActionPlugin;