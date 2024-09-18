import { Input, message, Modal, TreeDataNode, Typography } from "antd";
import { useCallback, useMemo, useRef, useState } from "react"
import { useCookies } from "react-cookie";
import useAPI, { APIs } from "../../../util/api";
import { useNavigate } from "react-router-dom";
import useNotes, { findNode } from "./store";
import { uuid } from "../../../util/secret";

type ReturnOfFunction<T = void> = [action: (params: T) => void, context: React.ReactNode];
export function useAdd(): ReturnOfFunction<TreeDataNode | null> {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [{ username }] = useCookies(["username"]);
    const [api, contextHolder] = message.useMessage();
    const { nodes, add } = useNotes();
    const nodeRef = useRef<TreeDataNode | null>();
    const addNote = useAPI(APIs.addNote);
    const navigate = useNavigate();

    const clear = (callback?: () => void) => {
        setInput(() => "");
        callback?.();
        setOpen(false);
        nodeRef.current = undefined;
    }
    const handleOk = useCallback(() => clear(() => {
        const node = nodeRef.current;
        if (node === undefined) return;

        const current = node ? node.key as string : null;
        const previous = (node ? node.children![node.children!.length - 1]?.key : nodes[nodes.length - 1]?.key) as string | null;
        const key = uuid();
        add(key, input, [], current, previous);
        // addNote({
        //     username: username, noteId: key, notename: input,
        //     parentId: current, silbling_id: previous
        // })[0]
        //     .then((res) => res.status === 200)
        //     .then(ok => {
        //         if (!ok) {
        //             api.error(`${input} 創建失敗`);
        //         }
        //         else {
        //             api.success(`${input} 創建成功`);
                    
        //             navigate(`../${key}`);
        //         }
        //     });
    }), [add, input, nodes]);

    const context = useMemo(() => (<>
        <Modal open={open} title="輸入名稱" okText="確認" cancelText="取消"
            onCancel={() => clear()} onOk={handleOk}>
            <Input value={input} placeholder="請輸入..." onChange={(e) => setInput(() => e.target.value)} />
        </Modal>
        {contextHolder}
    </>), [contextHolder, handleOk, input, open]);

    const act = useCallback((node: TreeDataNode | null) => {
        setOpen(true);
        nodeRef.current = node;
    }, []);

    return [act, context];
}

export function useDelete(): ReturnOfFunction<TreeDataNode> {
    const [open, setOpen] = useState(false);
    const nodeRef = useRef<TreeDataNode>();
    const navigate = useNavigate();
    const { nodes, remove } = useNotes();
    const [{ username }] = useCookies(["username"]);
    const deleteNote = useAPI(APIs.deleteNote);
    const [api, contextHolder] = message.useMessage();

    const clear = (callback?: () => void) => {
        callback?.();
        setOpen(false);
        nodeRef.current = undefined;
    }
    const handleOk = useCallback(() => clear(() => {
        const node = nodeRef.current;
        if (!node?.title) return;
        const { title } = node;
        const nodeFind = findNode(nodes, node.key as string);

        deleteNote({ username: username, noteId: node.key as string })[0]
            .then((res) => res.status === 200)
            .then(ok => {
                if (!ok) {
                    api.error(`${title} 刪除失敗`);
                }
                else {
                    api.success(`${title} 刪除成功`);
                    remove(node!.key as string);
                    const prev = nodeFind?.previous?.key as string | undefined;
                    const parent = nodeFind?.parent?.key as string;

                    navigate(prev ? `../${prev}` : `../${parent}`);
                }
            })
    }), [api, deleteNote, navigate, nodes, remove, username]);

    const context = useMemo(() => {
        const title = nodeRef.current?.title ? nodeRef.current?.title : "";

        return <>
            <Modal open={open} title={`刪除${title}`}
                onCancel={() => clear()} onOk={handleOk}
                okButtonProps={{ danger: true, type: "primary", children: "是" }}
                cancelButtonProps={{ danger: true, type: "default", children: "否" }}>
                <Typography.Text>{`是否刪除${title}`}</Typography.Text>
            </Modal >
            {contextHolder}
        </>
    }, [contextHolder, handleOk, open]);

    const act = useCallback((node: TreeDataNode) => {
        setOpen(true);
        nodeRef.current = node;
    }, []);

    return [act, context];
}