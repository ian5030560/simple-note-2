import { Tree, theme, Button, Flex, Typography, ButtonProps } from "antd";
import { FaPlus } from "react-icons/fa6";
import { NoteDataNode, useNodes } from "./store";
import { useState } from "react";
import { CloseOutlined, DeleteOutlined, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import useDirective from "./directive";
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

const NodeButton = ({ onClick, ...props }: Omit<ButtonProps, "type" | "tabIndex" | "size">) => <Button type="text" size="small" tabIndex={-1}
    onClick={(e) => { e.stopPropagation(); onClick?.(e) }} {...props} />;

const NoteTree = () => {
    const { token } = theme.useToken();
    const { nodes } = useNodes();
    const navigate = useNavigate();
    const [collaborative, setCollaborative] = useState(false);
    const {add, remove, contextHolder, cancelCollab} = useDirective();

    return <Flex vertical justify="space-between" style={{ flex: 1 }}>
        <div>
            <Tree treeData={!collaborative ? nodes : filter(nodes)} blockNode defaultExpandAll selectable={false}
                rootStyle={{ overflowY: "auto" }}
                titleRender={(data) => {

                    const first = nodes[0].key === data.key;
                    return <Flex justify="space-between" onClick={() => navigate(data.url ? data.url : data.key as string)}
                        style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
                        <Typography.Text>{data.title as string}</Typography.Text>
                        {
                            !collaborative && <Flex>
                                {!first && <NodeButton icon={<DeleteOutlined />} onClick={() => remove(data)} />}
                                <NodeButton icon={<PlusOutlined />} onClick={() => add(data)} />
                            </Flex>
                        }
                        {collaborative && <NodeButton icon={<CloseOutlined />} onClick={() => cancelCollab(data)} />}
                    </Flex>
                }} />

            {
                !collaborative && <Button icon={<FaPlus />} type="text" block tabIndex={-1}
                    onClick={() => add(null)} style={{ marginTop: 8, color: token.colorText }} />
            }
        </div>
        <Button type="default" icon={<SwapOutlined />} onClick={() => setCollaborative(prev => !prev)}>
            {!collaborative ? "個人筆記" : "多人協作"}
        </Button>
        {contextHolder}
    </Flex>
}

export default NoteTree;