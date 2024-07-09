import { Ref, forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Input, Flex, Typography, Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import uuid from "../../../util/uuid";


const { Text } = Typography;

interface NodeProp {
    title: string;
    onAdd: () => void;
    onDelete: () => void;
}

export default function Node(prop: NodeProp) {

    return <Flex justify="space-between" style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
        <Text>{prop.title}</Text>
        <Flex>
            <Button icon={<DeleteOutlined />} type="text" size="small" tabIndex={-1}
                onClick={(e) => { e.stopPropagation(); prop.onDelete() }} />
            <Button icon={<PlusOutlined />} type="text" size="small" tabIndex={-1}
                onClick={(e) => { e.stopPropagation(); prop.onAdd() }} />
        </Flex>
    </Flex>
}

interface ModalProps{
    open?: boolean;
    onCancel: () => void;
}
interface AddModalProps extends ModalProps{
    pKey: string | null;
    onOk: (key: string, pkey: string | null, input: string) => void;
}
export const AddModal = (prop: AddModalProps) => {
    const [input, setInput] = useState("");
    return <Modal open={prop.open} onCancel={prop.onCancel}
        title="輸入名稱" okText="確認" cancelText="取消"
        onOk={() => {
            prop.onOk(uuid(), prop.pKey, input);
            setInput(() => "");
        }}>
        <Input value={input} placeholder="請輸入..."
            onChange={(e) => setInput(() => e.target.value)} />
    </Modal>
}

interface DeleteModalProps extends ModalProps{
    onOk: (title: string) => void;
    title: string;
    tKey: string;
}
export const DeleteModal = (prop: DeleteModalProps) => {
    return <Modal open={prop.open} title={`刪除${prop.title}`}
        onCancel={prop.onCancel} onOk={() => prop.onOk(prop.tKey)}
        okButtonProps={{ danger: true, type: "primary" }} okText="是"
        cancelButtonProps={{ danger: true, type: "default" }} cancelText="否"
    >
        <Text>是否刪除{prop.title}</Text>
    </Modal >
}