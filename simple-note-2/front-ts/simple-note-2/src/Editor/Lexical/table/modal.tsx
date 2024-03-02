import { Flex, Modal } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./modal.module.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalCommand, createCommand } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { INSERT_TABLE } from ".";


export const OPEN_TABLE_MODAL: LexicalCommand<void> = createCommand();
const TableModal = () => {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const rowRef = useRef<HTMLInputElement>(null);
    const colRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(OPEN_TABLE_MODAL, () => {
                setOpen(true);
                return false;
            }, 4),
        )
    });

    const handleClick = useCallback(() => {
        let row = rowRef.current!.value;
        let col = colRef.current!.value;

        if(!isNaN(+row) && !isNaN(+col)){
            editor.dispatchCommand(INSERT_TABLE, {rows: +row, cols: +col});
            setOpen(false);
        }
    }, [editor]);

    const Footer = useMemo(() => {
        return <button type="button" className={styles.tableButton} onClick={handleClick}>插入</button>
    }, [handleClick]);

    return <Modal open={open} footer={Footer} title="插入表格" onCancel={() => setOpen(false)}>
        <Flex align="center" justify="center">
            <form>
                <div className={styles.tableFormWrapper}>
                    <label className={styles.tableFormLabel} htmlFor="row">Row: </label>
                    <input type="number" id="row" className={styles.tableFormInput} ref={rowRef}/>
                </div>
                <div className={styles.tableFormWrapper}>
                    <label className={styles.tableFormLabel} htmlFor="col">Column: </label>
                    <input type="number" id="col" className={styles.tableFormInput} ref={colRef}/>
                </div>
            </form>
        </Flex>

    </Modal>
}

export default TableModal;