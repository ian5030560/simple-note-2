import { useState } from "react";
import { Modal, Input, Flex, Typography, Button, TreeDataNode } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import useSupply, { createSupply, useSupplier } from "../../../util/supply";
 
const { Text } = Typography;

interface NodeProp {
    title: string;
    nodeKey: string;
    onAdd: (key: string, text: string) => void;
    onDelete: (key: string, text: string) => void;
    root?: boolean;
}
export default function Node(prop: NodeProp) {

    const [add, setAdd] = useState(false);
    const [deleted, setDelete] = useState(false);
    const [input, setInput] = useState("");

    return <Flex justify="space-between" style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
        <Text>{prop.title}</Text>
        <Flex>
            {
                !prop.root && <Button icon={<DeleteOutlined />} type="text" size="small" onClick={(e) => { e.preventDefault(); setDelete(true) }} />
            }
            <Button icon={<PlusOutlined />} type="text" size="small" onClick={(e) => { e.preventDefault(); setAdd(true) }} />
        </Flex>
        <Modal open={add} onCancel={() => setAdd(false)}
            title="輸入名稱" okText="確認" cancelText="取消"
            onOk={() => {
                setAdd(false);
                prop.onAdd?.(prop.nodeKey, input);
                setInput(() => "");
            }}>
            <Input value={input} placeholder="請輸入..." onChange={(e) => setInput(() => e.target.value)} />
        </Modal>
        <Modal open={deleted}
            onCancel={() => setDelete(false)}
            onOk={() => { setDelete(false); prop.onDelete?.(prop.nodeKey, prop.title) }}
            title={`刪除${prop.title}`} okButtonProps={{ danger: true, type: "primary" }} okText="是"
            cancelButtonProps={{ danger: true, type: "default" }} cancelText="否"
        >
            <Text>是否刪除{prop.title}</Text>
        </Modal >
    </Flex>
}

const FileNodeSupply = createSupply<TreeDataNode[]>();
export const useFileNodes = () => useSupply(FileNodeSupply);
export function FileNodeProvider({ children }: { children: React.ReactNode }) {
    const Supplier = useSupplier(FileNodeSupply,
        [{
            key: "individual",
            title: "個人筆記",
            children: [],
        }]
    );

    return <Supplier>
        {children}
    </Supplier>
}