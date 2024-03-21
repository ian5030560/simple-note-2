import { Flex } from "antd";
import { useCallback, useMemo, useRef } from "react";
import styles from "./modal.module.css";
import { LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import Modal, { ModalRef } from "../UI/modal";

export const OPEN_TABLE_MODAL: LexicalCommand<void> = createCommand();
const TableModal = () => {

    const [editor] = useLexicalComposerContext();
    const rowRef = useRef<HTMLInputElement>(null);
    const colRef = useRef<HTMLInputElement>(null);
    const ref = useRef<ModalRef>(null);

    const handleClick = useCallback(() => {
        let row = rowRef.current!.value;
        let col = colRef.current!.value;

        if (!isNaN(+row) && !isNaN(+col)) {
            editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: col, rows: row, includeHeaders: false });
            rowRef.current!.value = "";
            colRef.current!.value = "";
            ref.current?.close();
        }
    }, [editor]);

    const footer = useMemo(() => {
        return <button type="button" className={styles.tableFormButton} onClick={handleClick}>插入</button>
    }, [handleClick]);

    return <Modal command={OPEN_TABLE_MODAL} title="插入表格" ref={ref} footer={footer}>
        <Flex justify="center" align="center">
            <form>
                <div className={styles.tableFormWrapper}>
                    <label htmlFor="rows" className={styles.tableFormLabel}>Rows:</label>
                    <input type="number" className={styles.tableFormInput} id="rows" ref={rowRef} />
                </div>

                <div className={styles.tableFormWrapper}>
                    <label htmlFor="cols" className={styles.tableFormLabel}>Columns:</label>
                    <input type="number" className={styles.tableFormInput} id="cols" ref={colRef} />
                </div>
            </form>
        </Flex>
    </Modal>
}

export default TableModal;