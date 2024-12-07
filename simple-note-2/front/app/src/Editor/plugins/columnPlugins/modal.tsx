import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button, InputNumber } from "antd";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { $createColumnContainerNode } from "../../nodes/column/container";
import { $createColumnItemNode } from "../../nodes/column/item";
import { $createParagraphNode, $insertNodes, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { PLUSMENU_SELECTED } from "../draggablePlugin/command";
import Modal from "../../ui/modal";

export default function ColumnModalPlugin() {
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [editor] = useLexicalComposerContext();
    const [node, setNode] = useState<LexicalNode>();

    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({node, keyPath}) => {
        if(keyPath[0] === "column"){
            setNode(node);
            setOpen(true);
        }
        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

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
        return <>
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleOk}>確認</Button>
        </>;
    }, [handleOk]);

    return <Modal open={open} title="插入欄位" onCancel={() => setOpen(false)} footer={footer}>
        <InputNumber min={1} max={10} size="large" ref={inputRef} style={{ width: "100%" }} defaultValue={3} />
    </Modal>
}