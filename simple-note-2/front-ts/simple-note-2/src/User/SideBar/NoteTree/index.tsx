import { Tree, theme, Button, Flex } from "antd";
import Node from "./node";
import { FaPlus } from "react-icons/fa6";
import useFiles from "./store";
import { useState } from "react";
import { SwapOutlined } from "@ant-design/icons";
import { useAdd, useDelete } from "./function";
import { useNavigate } from "react-router-dom";

const NoteTree = () => {
    const { token } = theme.useToken();
    const { nodes } = useFiles();
    const navigate = useNavigate();
    const [collaborative, setCollaborative] = useState(false);
    const [add, addContext] = useAdd();
    const [remove, deleteContext] = useDelete();

    return <Flex vertical justify="space-between" style={{ height: "95%", overflowY: "auto" }}>
        <div>
            <Tree treeData={nodes} blockNode defaultExpandAll selectable={false}
                titleRender={(data) => <Node key={data.key} title={data.title as string}
                    // onClick={() => navigate(`/note/${data.key}`)}
                    onClick={() => {}}
                    onAdd={() => add(data)} onDelete={() => remove(data)} />
                } />

            <Button icon={<FaPlus />} type="text" block tabIndex={-1} style={{ marginTop: 8, color: token.colorText }}
                onClick={() => add(null)} />
        </div>
        <Button type="default" icon={<SwapOutlined />} onClick={() => setCollaborative(prev => !prev)}>
            {collaborative ? "個人筆記" : "多人協作"}
        </Button>
        {addContext}
        {deleteContext}
    </Flex>
}

export default NoteTree;