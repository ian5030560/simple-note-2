import { Ref, RefObject, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Modal, Input, Flex, Typography, Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";


const { Text } = Typography;

interface NodeProp {
    title: string;
    nodeKey: string;
    onAdd: (key: string) => void;
    onDelete: (key: string, title: string) => void;
}
export default function Node(prop: NodeProp) {

    return <Flex justify="space-between" style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
        <Text>{prop.title}</Text>
        <Flex>
            <Button icon={<DeleteOutlined />} type="text" size="small"
                onClick={(e) => { e.stopPropagation(); prop.onDelete(prop.nodeKey, prop.title) }} />
            <Button icon={<PlusOutlined />} type="text" size="small"
                onClick={(e) => { e.stopPropagation(); prop.onAdd(prop.nodeKey) }} />
        </Flex>
    </Flex>
}

export type FuncModalRef = {
    show: (val: boolean) => void;
}
interface AddModalProps {
    nodeKey: string;
    onOk: (key: string, text: string, root?: boolean) => void;
    root?: boolean;
}
export const AddModal = forwardRef((prop: AddModalProps, ref: Ref<FuncModalRef>) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    
    useImperativeHandle(ref, () => ({ show(val) { setOpen(val) } }));

    return <Modal open={open} onCancel={() => setOpen(false)}
        title="輸入名稱" okText="確認" cancelText="取消"
        onOk={() => {
            setOpen(false);
            prop.onOk(prop.nodeKey, input, prop.root);
            setInput(() => "");
        }}>
        <Input value={input} placeholder="請輸入..."
            onChange={(e) => setInput(() => e.target.value)} />
    </Modal>
});


interface DeleteModalProps extends Omit<AddModalProps, "root"> {
    title: string;
    onOk: (key: string) => void;
}
export const DeleteModal = forwardRef((prop: DeleteModalProps, ref: Ref<FuncModalRef>) => {

    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => ({ show(val) { setOpen(val) } }));

    return <Modal open={open} title={`刪除${prop.title}`}
        onCancel={() => setOpen(false)}
        onOk={() => { setOpen(false); prop.onOk(prop.nodeKey) }}
        okButtonProps={{ danger: true, type: "primary" }} okText="是"
        cancelButtonProps={{ danger: true, type: "default" }} cancelText="否"
    >
        <Text>是否刪除{prop.title}</Text>
    </Modal >
})