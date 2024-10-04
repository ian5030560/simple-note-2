import { Button, Flex, InputNumber } from "antd";
import { useCallback, useMemo, useRef, useState } from "react";
import styles from "./modal.module.css";
import { $createParagraphNode, $getSelection, $isBlockElementNode, $isRangeSelection, LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTableNodeWithDimensions } from "@lexical/table";
import Modal from "../../ui/modal";
import { $findMatchingParent } from "@lexical/utils";

export const OPEN_TABLE_MODAL: LexicalCommand<void> = createCommand();
export default function TableModalPlugin(){

    const [editor] = useLexicalComposerContext();
    const rowRef = useRef<HTMLInputElement>(null);
    const colRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const handleClick = useCallback(() => {
        const row = rowRef.current!.value;
        const col = colRef.current!.value;
      
        if (!isNaN(+row) && !isNaN(+col)) {
            editor.update(() => {
                const selection = $getSelection();
                if($isRangeSelection(selection)){
                    let anchor = selection.anchor.getNode();
                    const block = $isBlockElementNode(anchor) ? anchor : $findMatchingParent(anchor, p => $isBlockElementNode(p));

                    const table = $createTableNodeWithDimensions(Number(row), Number(col), false);
                    block?.insertAfter(table);
                    table.insertAfter($createParagraphNode());
                }
            });
            colRef.current?.setAttribute("value", "")
            rowRef.current?.setAttribute("value", "")
            setOpen(false);
        }
    }, [editor]);

    const footer = useMemo(() => {
        return <Button type="primary" onClick={handleClick}>插入</Button>
    }, [handleClick]);

    return <Modal command={OPEN_TABLE_MODAL} title="插入表格" footer={footer} open={open}
        onOpen={() => setOpen(true)} onClose={() => setOpen(false)}>
        <Flex justify="center" align="center">
            <form>
                <div className={styles.tableFormWrapper}>
                    <label htmlFor="rows" className={styles.tableFormLabel}>列數:</label>
                    <InputNumber id="rows" ref={rowRef} style={{width: "80%"}} defaultValue={3}/>
                </div>

                <div className={styles.tableFormWrapper}>
                    <label htmlFor="cols" className={styles.tableFormLabel}>欄數:</label>
                    <InputNumber id="cols" ref={colRef} style={{width: "80%"}} defaultValue={3}/>
                </div>
            </form>
        </Flex>
    </Modal>
}