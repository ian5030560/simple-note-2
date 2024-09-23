import { Tree, theme, Button, Flex, Typography } from "antd";
import { FaPlus } from "react-icons/fa6";
import useFiles, { NoteDataNode } from "./store";
import { useState } from "react";
import { DeleteOutlined, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { useAdd, useDelete } from "./function";
import { useNavigate } from "react-router-dom";

function filter(nodes: NoteDataNode[]) {
    const filtered: NoteDataNode[] = [];

    for (const node of nodes) {
        if (node.url) {
            filtered.push({ ...node, children: [] });
        }
        filtered.push(...filter(node.children!));
    }

    return filtered;
}
const NoteTree = () => {
    const { token } = theme.useToken();
    const { nodes } = useFiles();
    const navigate = useNavigate();
    const [collaborative, setCollaborative] = useState(false);
    const [add, addContext] = useAdd();
    const [remove, deleteContext] = useDelete();

    return <Flex vertical justify="space-between" style={{ flex: 1 }}>
        <div>
            <Tree treeData={!collaborative ? nodes : filter(nodes)} blockNode defaultExpandAll selectable={false}
                style={{overflowY: "auto", flexShrink: 1}}
                titleRender={(data) => <Flex justify="space-between" onClick={() => navigate(data.url ? data.url : data.key as string)}
                    style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
                    <Typography.Text>{data.title as string}</Typography.Text>
                    {
                        !collaborative && <Flex>
                            {nodes[0].key !== data.key &&
                                <Button icon={<DeleteOutlined />} type="text" size="small" tabIndex={-1}
                                    onClick={(e) => { e.stopPropagation(); remove(data) }} />
                            }
                            <Button icon={<PlusOutlined />} type="text" size="small" tabIndex={-1}
                                onClick={(e) => { e.stopPropagation(); add(data) }} />
                        </Flex>
                    }

                </Flex>} />

            {
                !collaborative && <Button icon={<FaPlus />} type="text" block tabIndex={-1}
                    onClick={() => add(null)} style={{ marginTop: 8, color: token.colorText }} />
            }
        </div>
        <Button type="default" style={{flexShrink: 1}} icon={<SwapOutlined />} onClick={() => setCollaborative(prev => !prev)}>
            {!collaborative ? "個人筆記" : "多人協作"}
        </Button>
        {addContext}
        {deleteContext}
    </Flex>
}

export default NoteTree;