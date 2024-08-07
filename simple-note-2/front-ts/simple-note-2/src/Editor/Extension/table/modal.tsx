import { Button, Flex, InputNumber, InputRef } from "antd";
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
            colRef.current?.setAttribute("value", "")
            rowRef.current?.setAttribute("value", "")
            ref.current?.close();
        }
    }, [editor]);

    const footer = useMemo(() => {
        return <Button type="primary" onClick={handleClick}>插入</Button>
    }, [handleClick]);

    return <Modal command={OPEN_TABLE_MODAL} title="插入表格" ref={ref} footer={footer}>
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

export default TableModal;