import {Modal as AntModal, ModalProps} from "antd";

export default function Modal({centered, footer, ...props}: ModalProps){
    return <AntModal centered={centered || true} footer={footer || null} {...props}/>;
}