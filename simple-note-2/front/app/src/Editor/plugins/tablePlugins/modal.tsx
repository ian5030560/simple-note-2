import { Button, Flex, InputNumber } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./modal.module.css";
import { $createParagraphNode, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTableNodeWithDimensions } from "@lexical/table";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { PLUSMENU_SELECTED } from "../draggablePlugin/command";
import Modal from "../../ui/modal";

export default function TableModalPlugin() {

    const [editor] = useLexicalComposerContext();
    const rowRef = useRef<HTMLInputElement>(null);
    const colRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<LexicalNode>();

    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({node, value}) => {
        if(value === "table"){
            setOpen(true);
            setNode(node);
        } 
        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

    const handleClick = useCallback(() => {
        const row = rowRef.current!.value;
        const col = colRef.current!.value;

        if (!isNaN(+row) && !isNaN(+col)) {
            editor.update(() => {
                const table = $createTableNodeWithDimensions(Number(row), Number(col), false);
                if(!node){
                    $insertNodeToNearestRoot(table);
                }
                else{
                    node.insertAfter(table);
                }
                table.insertAfter($createParagraphNode());
            });
            colRef.current?.setAttribute("value", "")
            rowRef.current?.setAttribute("value", "")
            setOpen(false);
        }
    }, [editor, node]);

    const footer = useMemo(() => {
        return <Button type="primary" onClick={handleClick}>插入</Button>
    }, [handleClick]);

    return <Modal title="插入表格" footer={footer} open={open} onCancel={() => setOpen(false)}>
        <Flex justify="center" align="center">
            <form>
                <div className={styles.tableFormWrapper}>
                    <label htmlFor="rows" className={styles.tableFormLabel}>列數:</label>
                    <InputNumber id="rows" ref={rowRef} style={{ width: "80%" }} defaultValue={3} />
                </div>

                <div className={styles.tableFormWrapper}>
                    <label htmlFor="cols" className={styles.tableFormLabel}>欄數:</label>
                    <InputNumber id="cols" ref={colRef} style={{ width: "80%" }} defaultValue={3} />
                </div>
            </form>
        </Flex>
    </Modal>
}