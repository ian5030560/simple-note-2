import { Ref, forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";
import { Modal, Input, Flex, Typography, Button, TreeDataNode } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { uuid } from "../../../util/random";


const { Text } = Typography;
export const seperator = "$";

interface NodeProp {
    title: string;
    nodeKey: string;
    childNodes: TreeDataNode[];
    onAdd: (key: string) => void;
    onDelete: (key: string, title: string) => void;
}

export default function Node(prop: NodeProp) {
    
    const createKey = useCallback(() => {
        let nindex = prop.childNodes.length;
        let oindex = prop.nodeKey.split(seperator)[1];

        return `${uuid()}${seperator}${oindex}-${nindex}`;
    }, [prop.childNodes.length, prop.nodeKey]);

    let unremovable = useMemo(() => {
        let splited = prop.nodeKey.split(seperator)[1].split(seperator);
        return splited.length === 1 && splited[0] === "0";
    }, [prop.nodeKey]);

    return <Flex justify="space-between" style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
        <Text>{prop.title}</Text>
        <Flex>
            {
                !unremovable &&
                <Button icon={<DeleteOutlined />} type="text" size="small"
                    onClick={(e) => { e.stopPropagation(); prop.onDelete(prop.nodeKey, prop.title) }} />
            }
            <Button icon={<PlusOutlined />} type="text" size="small"
                onClick={(e) => { e.stopPropagation(); prop.onAdd(createKey()) }} />
        </Flex>
    </Flex>
}

type FuncModalRef<T> = {
    show: (val: T) => void;
}

export type AddModalRef = FuncModalRef<string>;
interface AddModalProps {
    onOk: (key: string, text: string) => void;
}
export const AddModal = forwardRef((prop: AddModalProps, ref: Ref<AddModalRef>) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [key, setKey] = useState("");
   
    useImperativeHandle(ref, () => ({ show(val) { setOpen(true); setKey(val) } }));

    return <Modal open={open} onCancel={() => setOpen(false)}
        title="輸入名稱" okText="確認" cancelText="取消"
        onOk={() => {
            setOpen(false);
            prop.onOk(key, input);
            setInput(() => "");
        }}>
        <Input value={input} placeholder="請輸入..."
            onChange={(e) => setInput(() => e.target.value)} />
    </Modal>
});


export type DeleteModalRef = FuncModalRef<{ title: string, key: string }>;
interface DeleteModalProps {
    onOk: (key: string, text: string) => void;
}
export const DeleteModal = forwardRef((prop: DeleteModalProps, ref: Ref<DeleteModalRef>) => {

    const [open, setOpen] = useState(false);
    const [state, setState] = useState<{ title: string, key: string }>();

    useImperativeHandle(ref, () => ({ show(val) { setOpen(true); setState(val); } }));

    return <Modal open={open} title={`刪除${state?.title}`}
        onCancel={() => setOpen(false)}
        onOk={() => { setOpen(false); prop.onOk(state!.key, state!.title) }}
        okButtonProps={{ danger: true, type: "primary" }} okText="是"
        cancelButtonProps={{ danger: true, type: "default" }} cancelText="否"
    >
        <Text>是否刪除{state?.title}</Text>
    </Modal >
})