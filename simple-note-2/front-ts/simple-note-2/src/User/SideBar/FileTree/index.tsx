import { Tree, theme, Button, message, TreeDataNode } from "antd";
import Node, { AddModal, DeleteModal } from "./node";
import { FaPlus } from "react-icons/fa6";
import useFiles, { findNode } from "./hook";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAPI, { APIs } from "../../../util/api";
import { useCookies } from "react-cookie";
import uuid from "../../../util/uuid";

const FileTree = () => {
    const { token } = theme.useToken();
    const [nodes, add, remove] = useFiles();
    const [api, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [addOpen, setAddOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const targetRef = useRef<TreeDataNode | null>(null);
    const addNote = useAPI(APIs.addNote);
    const deleteNote = useAPI(APIs.deleteNote);
    const [{ username }] = useCookies(["username"]);

    const handleAdd = useCallback((input: string) => {
        setAddOpen(false);
        let node = targetRef.current;

        let current = node ? node.key as string : null;
        let previous = node ? node.children![node.children!.length - 1]?.key as string | null : nodes[nodes.length - 1].key as string;
        let key = uuid();

        addNote({
            username: username, noteId: key, notename: input,
            parentId: current, silbling_id: previous
        })[0]
            .then((res) => res.status === 200)
            .then(ok => {
                if (!ok) {
                    api.error(`${input} 創建失敗`)
                }
                else {
                    api.success(`${input} 創建成功`)
                    add(key, input, [], current, previous)
                    navigate(`/${key}`)
                }
            })

    }, [add, addNote, api, navigate, nodes, username]);

    const handleDelete = useCallback((title: string) => {
        setDelOpen(false);

        let node = targetRef.current;
        if(!node) return;
        let nodeFind = findNode(nodes, node.key as string)
        
        deleteNote({ username: username, noteId: node.key as string })[0]
            .then((res) => res.status === 200)
            .then(ok => {
                if (!ok) {
                    api.error(`${title} 刪除失敗`);
                }
                else {
                    api.success(`${title} 刪除成功`);
                    remove(node!.key as string);
                    let prev = nodeFind?.previous?.key as string | undefined
                    let parent = nodeFind!.parent!.key as string
                    prev ? navigate(`/${prev}`) : navigate(`/${parent}`)
                }
            })
    }, [api, deleteNote, navigate, nodes, remove, username]);

    return <>
        <Tree treeData={nodes} blockNode defaultExpandAll selectable={false}
            titleRender={(data) => <Node key={data.key} title={data.title as string}
                    onClick={() => navigate(`/${data.key}`)}
                    onAdd={() => {
                        setAddOpen(true);
                        targetRef.current = data;
                    }}
                    onDelete={() => {
                        setDelOpen(true);
                        targetRef.current = data;
                    }} />
            } />

        <Button icon={<FaPlus />} type="text" block tabIndex={-1} style={{ marginTop: 8, color: token.colorText }}
            onClick={() => {
                setAddOpen(true);
                targetRef.current = null;
            }} />
        <AddModal open={addOpen} onCancel={() => setAddOpen(false)} onOk={handleAdd} />
        <DeleteModal open={delOpen} onCancel={() => setDelOpen(false)}
            onOk={handleDelete} title={targetRef.current?.title as string | undefined} />
        {contextHolder}
    </>
}

export default FileTree;