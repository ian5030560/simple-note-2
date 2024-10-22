import { Tree, Button, Flex, Typography, ButtonProps } from "antd";
import { FaPlus } from "react-icons/fa6";
import { useNodes } from "./store";
import { useMemo } from "react";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import useDirective from "./directive";
import { useNavigate } from "react-router-dom";

const NodeButton = ({ onClick, ...props }: Omit<ButtonProps, "type" | "tabIndex" | "size">) => <Button type="text" size="small" tabIndex={-1}
    onClick={(e) => { e.stopPropagation(); onClick?.(e) }} {...props} />;

const NoteTree = () => {
    const { nodes } = useNodes();
    const navigate = useNavigate();
    const { add, remove, contextHolder, cancelCollab } = useDirective();

    const one = useMemo(() => nodes.find(it => it.key === "one")!, [nodes]);
    const multiple = useMemo(() => nodes.find(it => it.key === "multiple")!, [nodes]);

    return <Flex vertical gap={5} style={{ flex: 1 }}>
        <div>
            <Flex justify="space-between" align="center" style={{padding: 8, paddingRight: 0}}>
                <Typography.Text type="secondary">個人筆記</Typography.Text>
                <Button type="text" icon={<FaPlus />} onClick={() => add(null)}/>
            </Flex>

            <Tree treeData={one.children} blockNode selectable={false}
                rootStyle={{ overflowY: "auto" }} defaultExpandAll
                titleRender={(data) => {
                    const first = one.children[0].key === data.key;

                    return <Flex justify="space-between" onClick={() => navigate(data.url ? data.url : data.key as string)}
                        style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
                        <Typography.Text>{data.title as string}</Typography.Text>
                        <Flex>
                            {!first && <NodeButton icon={<DeleteOutlined />} onClick={() => remove(data)} />}
                            <NodeButton icon={<PlusOutlined />} onClick={() => add(data)} />
                        </Flex>
                    </Flex>
                }} />
        </div>

        <div>
            <Flex style={{padding: 8}}>
                <Typography.Text type="secondary">協作筆記</Typography.Text>
            </Flex>

            <Tree treeData={multiple.children} blockNode selectable={false}
                rootStyle={{ overflowY: "auto" }} defaultExpandAll
                titleRender={(data) => <Flex justify="space-between" onClick={() => navigate(data.url!)}
                    style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
                    <Typography.Text>{data.title as string}</Typography.Text>
                    <Button type="text" icon={<CloseOutlined />} onClick={() => cancelCollab(data)}/>
                </Flex>} />
        </div>
        {contextHolder}
    </Flex>
}

export default NoteTree;