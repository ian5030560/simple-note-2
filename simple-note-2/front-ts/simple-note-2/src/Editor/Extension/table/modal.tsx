import { Flex, Modal } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./modal.module.css";
import { LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {mergeRegister} from "@lexical/utils";
import {INSERT_TABLE_COMMAND} from "@lexical/table";

export const OPEN_TABLE_MODAL: LexicalCommand<void> = createCommand();
const TableModal = () => {

    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();
    const rowRef = useRef<HTMLInputElement>(null);
    const colRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(OPEN_TABLE_MODAL, () => {
                setOpen(true);
                return false;
            }, 4),
        )
    }, [editor]);

    const handleClick = useCallback(() => {
        let row = rowRef.current!.value;
        let col = colRef.current!.value;

        if(!isNaN(+row) && !isNaN(+col)){
            editor.dispatchCommand(INSERT_TABLE_COMMAND, {columns: col, rows: row, includeHeaders: false});
            rowRef.current!.value = "";
            colRef.current!.value = "";
            setOpen(false);
        }
    }, [editor]);

    const footer = useMemo(() => {
        return <button type="button" className={styles.tableFormButton} onClick={handleClick}>插入</button>
    }, [handleClick]);

    return <Modal footer={footer} title="插入表格" open={open} onCancel={() => setOpen(false)}>
        <Flex justify="center" align="center">
            <form>
                <div className={styles.tableFormWrapper}>
                    <label htmlFor="rows" className={styles.tableFormLabel}>Rows:</label>
                    <input type="number" className={styles.tableFormInput} id="rows" ref={rowRef}/>
                </div>

                <div className={styles.tableFormWrapper}>
                    <label htmlFor="cols" className={styles.tableFormLabel}>Columns:</label>
                    <input type="number" className={styles.tableFormInput} id="cols" ref={colRef}/>
                </div>
            </form>
        </Flex>
    </Modal>
}

export default TableModal;