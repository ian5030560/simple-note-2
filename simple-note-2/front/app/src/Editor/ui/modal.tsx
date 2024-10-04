import { LexicalCommand } from "lexical";
import { Modal as AntModal } from "antd";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ModalStyles } from "../../../../node_modules/rc-dialog/lib/IDialogPropTypes"
export interface ModalProps{
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    command: LexicalCommand<any>;
    footer?: React.ReactNode;
    children: React.ReactNode;
    title?: React.ReactNode;
    width?: string | number;
    destroyOnClose?: boolean;
    style?: React.CSSProperties;
    styles?: ModalStyles;
}
export default function Modal(props: ModalProps) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(props.command, () => {
            props.onOpen();
            return true;
        }, 4);
    })
    return <AntModal open={props.open} onCancel={props.onClose} centered width={props.width}
        footer={props.footer ? props.footer : null} title={props.title} destroyOnClose={props.destroyOnClose}
        style={props.style} styles={props.styles}>
        {props.children}
    </AntModal>
}