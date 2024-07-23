import { Tree, theme, Button, message } from "antd";
import Node, { AddModal, DeleteModal } from "./node";
import { FaPlus } from "react-icons/fa6";
import useFiles from "./hook";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

const FileTree = () => {
    const { token } = theme.useToken();
    const [nodes, add, remove] = useFiles();
    const [api, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [addOpen, setAddOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const [pKey, setPKey] = useState<string | null>(null);
    const [delTitle, setDelTitle] = useState("");
    const [tKey, setTKey] = useState("");

    const handleAdd = useCallback((key: string, pKey: string | null, input: string) => {
        add(key, input, [], pKey, null);
        setAddOpen(false);
    }, [add]);

    const handleDelete = useCallback((key: string) => {
        remove(key);
        setDelOpen(false);
    }, [remove]);
    
    return <>
        <Tree treeData={nodes} blockNode defaultExpandAll selectable={false}
            titleRender={(data) => {
                const { title, key } = data as { title: string, key: string };
                return <Node key={key} title={title}
                    onAdd={() => {
                        setAddOpen(true);
                        setPKey(key);
                    }}
                    onDelete={() => {
                        setDelOpen(true);
                        setDelTitle(title);
                        setTKey(key);
                    }} />
            }} />

        <Button icon={<FaPlus />} type="text" block tabIndex={-1} style={{marginTop: 8, color: token.colorText}}
            onClick={() => {
                setAddOpen(true);
                setPKey(null);
            }}/>
        <AddModal open={addOpen} onCancel={() => setAddOpen(false)}
            onOk={handleAdd} pKey={pKey} />
        <DeleteModal open={delOpen} onCancel={() => setDelOpen(false)}
            onOk={handleDelete} title={delTitle} tKey={tKey} />
        {contextHolder}
    </>
}

export default FileTree;