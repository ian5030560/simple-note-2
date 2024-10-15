import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Flex, Button, InputNumber } from "antd";
import { useState, useRef, useCallback, useMemo } from "react";
import { OPEN_COLUMN_MODAL } from "./command";
import Modal from "../../ui/modal";
import { $createColumnContainerNode } from "../../nodes/column/container";
import { $createColumnItemNode } from "../../nodes/column/item";
import useMenuFocused from "../draggablePlugin/store";
import { $createParagraphNode, $insertNodes } from "lexical";

export default function ColumnLayoutModal() {
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [editor] = useLexicalComposerContext();
    const { node } = useMenuFocused();

    const handleOk = useCallback(() => {
        const value = inputRef.current?.value;
        if (!value) return;

        const payload = parseInt(value);
        editor.update(() => {
            const container = $createColumnContainerNode(payload);
            for (let i = 0; i < payload; i++) {
                container.append($createColumnItemNode().append($createParagraphNode()))
            }

            if(!node){
                $insertNodes([container]);
            }
            else{
                node.insertAfter(container);
            }
            container.selectStart();
        })
        setOpen(false);
    }, [editor, node]);

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