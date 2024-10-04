import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Flex, Button, InputNumber } from "antd";
import { useState, useRef, useCallback, useMemo } from "react";
import { INSERT_COLUMNS, OPEN_COLUMN_MODAL } from "./command";
import Modal from "../../ui/modal";

export default function ColumnLayoutModal(){
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [editor] = useLexicalComposerContext();

    const handleOk = useCallback(() => {
        const value = inputRef.current?.value;
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