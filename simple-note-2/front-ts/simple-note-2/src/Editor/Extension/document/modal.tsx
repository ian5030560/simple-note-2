import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "antd";
import { LexicalCommand, createCommand } from "lexical";
import { useCallback, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import { INSERT_FILE } from "./plugin";
import Modal, { ModalRef } from "../UI/modal";

export const OPEN_DOCUMENT_MODAL: LexicalCommand<void> = createCommand();
const DocumentModal = () => {
    const [editor] = useLexicalComposerContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const ref = useRef<ModalRef>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target || !e.target.files) return;
        let file = e.target.files[0];
        editor.dispatchCommand(INSERT_FILE, {
            name: "pdf", payload: {
                width: 800, height: 400, src: URL.createObjectURL(file),
            }
        })

        ref.current?.close();
    }, [editor]);


    return <Modal command={OPEN_DOCUMENT_MODAL} footer={null} ref={ref} title="上傳文件">
        <Button block type="primary" icon={<FaUpload />} onClick={() => inputRef.current?.click()}>上傳</Button>
        <input type="file" accept=".pdf" style={{ display: "none" }} ref={inputRef} onChange={(e) => handleChange(e)} />
    </Modal>
}

export default DocumentModal;