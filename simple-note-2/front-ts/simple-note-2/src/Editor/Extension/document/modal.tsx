import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "antd";
import { LexicalCommand, createCommand } from "lexical";
import { useCallback, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { INSERT_FILE } from "./plugin";
import Modal from "../UI/modal";

export const OPEN_DOCUMENT_MODAL: LexicalCommand<void> = createCommand();
const DocumentModal = () => {
    const [editor] = useLexicalComposerContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target || !e.target.files) return;
        let file = e.target.files[0];
        let [type] = file.name.split(".").reverse();

        switch (type) {
            case "pdf":
                editor.dispatchCommand(INSERT_FILE, {
                    name: "pdf",
                    payload: { width: 800, height: 400, src: URL.createObjectURL(file), }
                })
                break;
            default:
                editor.dispatchCommand(INSERT_FILE, {
                    name: type,
                    payload: {
                        src: URL.createObjectURL(file),
                        name: file.name,
                    }
                })
        }

        setOpen(false);
    }, [editor]);


    return <Modal command={OPEN_DOCUMENT_MODAL} open={open} title="上傳文件"
        onOpen={() => setOpen(true)} onClose={() => setOpen(false)}>
        <Button block type="primary" icon={<FaUpload />} onClick={() => inputRef.current?.click()}>上傳</Button>
        <input type="file" style={{ display: "none" }} ref={inputRef} onChange={(e) => handleChange(e)} />
    </Modal>
}

export default DocumentModal;