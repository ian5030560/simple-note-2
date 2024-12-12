import { Button, Dropdown, MenuProps } from "antd";
import { cloneElement, useEffect, useMemo, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $isTableSelection, $getTableCellNodeFromLexicalNode,
    $insertTableColumn__EXPERIMENTAL, $insertTableRow__EXPERIMENTAL,
    $deleteTableColumn__EXPERIMENTAL, $deleteTableRow__EXPERIMENTAL,
    $isTableNode,
} from "@lexical/table";
import { $getSelection, $isRangeSelection, NodeKey, SELECTION_CHANGE_COMMAND } from "lexical";
import styles from "./action.module.css";
import Action, { WithAnchorProps } from "../../ui/action";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { PencilSquare } from "react-bootstrap-icons";

type TableActionPluginProps = WithAnchorProps;
export default function TableActionPlugin(props: TableActionPluginProps) {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const [key, setKey] = useState<NodeKey>();

    useEffect(() => mergeRegister(
        editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            const selection = $getSelection();
            if($isRangeSelection(selection) || $isTableSelection(selection)){
                const node = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                if(node){
                    setKey(node.getKey());
                    setOpen(true);
                    return false;
                }
            }

            setKey(undefined);
            setOpen(false);
            
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

    return <Action nodeKey={key} inner open={open} placement={"top-end"} anchor={props.anchor}>
        <div className="simple-note-2-table-cell-action-button-container">
            <Dropdown menu={{ items }} trigger={["click"]} placement="bottom" autoAdjustOverflow
                dropdownRender={(node) => cloneElement(node as React.JSX.Element, { className: styles.dropDown })}>
                <Button type="text" className="simple-note-2-table-cell-action-button"
                    icon={<PencilSquare />} />
            </Dropdown>
        </div>
    </Action>;
}