import { createPortal } from "react-dom";
import { CiCircleChevDown } from "react-icons/ci";
import { Plugin } from "../../index";
import { Dropdown, MenuProps } from "antd";
import { cloneElement, useEffect, useMemo, useRef, useState } from "react";
import { useWrapper } from "../../../Draggable/component";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isTableSelection, $getTableCellNodeFromLexicalNode, 
    $insertTableColumn__EXPERIMENTAL, $insertTableRow__EXPERIMENTAL,
    $deleteTableColumn__EXPERIMENTAL, $deleteTableRow__EXPERIMENTAL,
} from "@lexical/table";
import { $getSelection, $isRangeSelection } from "lexical";
import { mergeRegister } from "@lexical/utils";
import styles from "./action.module.css";

const DEFAULT = { top: -10000, left: -10000 };
const TableActionPlugin: Plugin = () => {
    const [pos, setPos] = useState<{ top: number, left: number }>(DEFAULT);
    const wrapper = useWrapper();
    const [editor] = useLexicalComposerContext();
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const selection = $getSelection();
                    let position = DEFAULT;

                    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
                        let node = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                        if(node){
                            let {top, left, width} = editor.getElementByKey(node.getKey())!.getBoundingClientRect();
                            let {top: ptop, left: pleft} = wrapper!.getBoundingClientRect();
                            let {width: offset} = ref.current!.getBoundingClientRect();
    
                            position = {top: top - ptop, left: left - pleft + width - offset};
                        }

                    }
                    setPos(position);
                })
            })
        )
    }, [editor, wrapper]);

    const items: MenuProps["items"] = useMemo(() => {
        return [
            {
                key: "addRowAbove",
                label: "add row above",
                onClick: () => editor.update(() => $insertTableRow__EXPERIMENTAL(false)),
            },
            {
                key: "addRowBelow",
                label: "add row below",
                onClick: () => editor.update(() => $insertTableRow__EXPERIMENTAL(true)),
            },
            {
                key: "addColumnLeft",
                label: "add column left",
                onClick: () => editor.update(() => $insertTableColumn__EXPERIMENTAL(false)),
            },
            {
                key: "addColumnRight",
                label: "add column right",
                onClick: () => editor.update(() => $insertTableColumn__EXPERIMENTAL(true)),
            },
            {
                key: "divider",
                label: <hr />,
                disabled: true,
            },
            {
                key: "deleteRow",
                label: "delete row",
                onClick: () => editor.update(() => $deleteTableRow__EXPERIMENTAL()),
            },
            {
                key: "deleteColumn",
                label: "delete column",
                onClick: () => editor.update(() => $deleteTableColumn__EXPERIMENTAL()),
            },
        ]
    }, [editor]);

    return wrapper ? createPortal(
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottom" autoAdjustOverflow
            dropdownRender={(node) => cloneElement(node as React.JSX.Element, {className: styles.dropDown})}>
            <div className="simple-note-2-table-cell-action-button-container"
                style={{ transform: `translate(${pos.left}px, ${pos.top}px)` }}>
                <button type="button" className="simple-note-2-table-cell-action-button" ref={ref}>
                    <CiCircleChevDown size={20}/>
                </button>
            </div>
        </Dropdown>,
        wrapper
    ) : null;
}

export default TableActionPlugin;