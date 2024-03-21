import { LexicalCommand } from "lexical";
import { Modal as AntModal, ModalProps } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export type ModalRef = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}
export interface ModalProp extends Omit<ModalProps, "open" | "onCancel" | "onOk"> {
    command: LexicalCommand<void>;
    onClose?: () => void;
    onOk?: () => void;
    onOpen?: () => void;
}
const Modal = forwardRef(({ command, onClose, onOk, onOpen, ...prop }: ModalProp, ref: React.ForwardedRef<ModalRef>) => {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    
    useImperativeHandle(ref, () => ({
        isOpen: open,
        open: () => setOpen(true),
        close: () => setOpen(false),
    }))

    useEffect(() => {
        return editor.registerCommand(command, () => {
            setOpen(true);
            onOpen?.();
            return true;
        }, 4)
    })

    return <AntModal open={open} centered
        onCancel={() => {
            onClose?.();
            setOpen(false);
        }}
        onOk={() => {
            onOk?.();
            setOpen(false);
        }} {...prop}/>
})

export default Modal;