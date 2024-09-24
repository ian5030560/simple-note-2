import { Input, message, Modal, TreeDataNode, Typography } from "antd";
import { useCallback, useMemo, useRef, useState } from "react"
import { useCookies } from "react-cookie";
import useAPI, { APIs } from "../../../util/api";
import { useNavigate } from "react-router-dom";
import useNotes from "./store";
import { uuid } from "../../../util/secret";

type ReturnOfFunction<T = void> = [action: (params: T) => void, context: React.ReactNode];
export function useAdd(): ReturnOfFunction<TreeDataNode | null> {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [{ username }] = useCookies(["username"]);
    const [api, contextHolder] = message.useMessage();
    const { nodes, add, findNode } = useNotes();
    const nodeRef = useRef<TreeDataNode | null>();
    const addNote = useAPI(APIs.addNote);
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    const clear = (callback?: () => void) => {
        setInput(() => "");
        callback?.();
        setOpen(false);
        nodeRef.current = undefined;
    }

    const handleOk = useCallback(() => clear(() => {
        if (error) return;

        const node = nodeRef.current;
        if (node === undefined) return;

        const current = node ? node.key as string : null;
        const previous = (node ? node.children![node.children!.length - 1]?.key : nodes[nodes.length - 1]?.key) as string | null;
        const key = uuid();
        addNote({
            username: username, noteId: key, notename: input,
            parentId: current, silbling_id: previous
        })[0]
            .then((res) => res.status === 200)
            .then(ok => {
                if (!ok) {
                    api.error(`${input} 創建失敗`);
                }
                else {
                    api.success(`${input} 創建成功`);
                    add(key, input, [], current, previous);
                    navigate(`${key}`);
                }
            });
    }), [add, addNote, api, error, input, navigate, nodes, username]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const children = nodeRef.current ? findNode(nodeRef.current.key as string)?.current?.children : nodes;
        if (!children) return;
        let flag = false;
        children.forEach(it => {
            if (it.title === e.target.value) {
                flag = true;
                return;
            }
        });

        setError(flag);
        setInput(() => e.target.value);
    }, [findNode, nodes]);

    const context = useMemo(() => (<>
        <Modal open={open} title="輸入名稱" okText="確認" cancelText="取消"
            onCancel={() => clear()} onOk={handleOk}>
            <div style={{ position: "relative" }}>
                <Input value={input} placeholder="請輸入..." onChange={handleChange} status={error ? "error" : undefined} />

                <Typography.Text type="danger"
                    style={{
                        position: "absolute", top: "100%", left: 0,
                        opacity: !error ? 0 : 1,
                        transition: "opacity 250ms ease"
                    }}>
                    在同一層的筆記不能有重複名稱
                </Typography.Text>
            </div>
        </Modal>
        {contextHolder}
    </>), [contextHolder, error, handleChange, handleOk, input, open]);

    const act = useCallback((node: TreeDataNode | null) => {
        setOpen(true);
        setError(false);
        nodeRef.current = node;
    }, []);

    return [act, context];
}

export function useDelete(): ReturnOfFunction<TreeDataNode> {
    const [open, setOpen] = useState(false);
    const nodeRef = useRef<TreeDataNode>();
    const navigate = useNavigate();
    const { nodes, remove, findNode } = useNotes();
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
        const nodeFind = findNode(node.key as string);

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

                    navigate(prev ? prev : parent);
                }
            })
    }), [api, deleteNote, findNode, navigate, remove, username]);

    const context = useMemo(() => {
        const title = nodeRef.current?.title ? nodeRef.current?.title : "";

        return <>
            <Modal open={open} title={`刪除${title}`}
                onCancel={() => clear()} onOk={handleOk}
                okText="是" cancelText="否"
                okButtonProps={{ danger: true, type: "primary" }}
                cancelButtonProps={{ danger: true, type: "default" }}>
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