import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "antd";
import { COMMAND_PRIORITY_CRITICAL, LexicalCommand, LexicalNode, createCommand } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { $createDocumentNode } from "../../nodes/document";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { PLUSMENU_SELECTED } from "../draggablePlugin/command";
import Modal from "../../ui/modal";

export const OPEN_DOCUMENT_MODAL: LexicalCommand<void> = createCommand();
const DocumentModal = () => {
    const [editor] = useLexicalComposerContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<LexicalNode>();

    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({node, value}) => {
        if(value !== "document") return false;
        setNode(node);
        setOpen(true);
        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        if (!e.target || !e.target.files) return;
        const file = e.target.files[0];
        // const [type] = file.name.split(".").reverse();

        editor.update(() => {
            const src = URL.createObjectURL(file);
            const name = file.name;

            let doc = $createDocumentNode(src, name);
            // switch(type){
            //     case "pdf":
            //         doc = $createPDFNode(800, 400, src);
            //         break;
            //     default:
            //         doc = $createDocumentNode(src, name);
            // }

            if (!node) {
                $insertNodeToNearestRoot(doc);
            }
            else {
                node.insertAfter(doc);
            }
        });

        setOpen(false);
    }, [editor, node]);

    return <Modal open={open} title="上傳文件" onCancel={() => setOpen(false)}>
        <Button block type="primary" icon={<FaUpload />} onClick={() => inputRef.current?.click()}>上傳</Button>
        <input type="file" style={{ display: "none" }} ref={inputRef} onChange={(e) => handleChange(e)} />
    </Modal>
}

export default DocumentModal;