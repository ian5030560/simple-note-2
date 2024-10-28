import { Input, message, Modal, Typography } from "antd";
import { useCallback, useMemo, useState } from "react"
import { useCookies } from "react-cookie";
import useAPI from "../../../util/api";
import { useNavigate } from "react-router-dom";
import { NoteDataNode, useNodes } from "./store";
import { decodeBase64, uuid } from "../../../util/secret";

type AddState = {
    open: boolean;
    input: string;
    error: boolean;
    node: NoteDataNode | null;
}

type DeleteState = {
    open: boolean;
    node: NoteDataNode | null;
}

type CancelCollabState = DeleteState;
export default function useDirective() {
    const [add, setAdd] = useState<AddState>({ open: false, input: "", error: false, node: null });
    const [_delete, setDelete] = useState<DeleteState>({ open: false, node: null });
    const [cancelCollab, setCancelCollab] = useState<CancelCollabState>({ open: false, node: null });
    const { nodes, findNode, update, add: _add, remove } = useNodes();
    const [{ username }] = useCookies(["username"]);
    const [api, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const addNote = useAPI(APIs.addNote);
    const deleteNote = useAPI(APIs.deleteNote);
    const cancelCollborate = useAPI(APIs.deleteCollaborate);

    const clearAdd = () => setAdd({ input: "", open: false, node: null, error: false });
    const handleAdd = useCallback(() => {
        const { error, node, input } = add;
        if (error || !input) return;

        const current = node?.key as string || null;
        const previous = (node ? node.children![node.children!.length - 1]?.key : nodes["one"].at(-1)?.key) as string | null;
        const key = uuid();

        addNote({
            username: username, noteId: key, notename: input,
            parentId: current, silbling_id: previous
        })[0]
            .then(ok => {
                if (!ok) {
                    api.error(`${input} 創建失敗`);
                }
                else {
                    api.success(`${input} 創建成功`);
                    _add(key, input, { parentKey: current, siblingKey: previous });
                    navigate(key);
                }
            });

        clearAdd();
    }, [_add, add, addNote, api, navigate, nodes, username]);

    const handleAddInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { node } = add;
        const children = node ? findNode(node.key as string)?.current?.children : nodes["one"];
        if (!children) return;

        let flag = false;
        for(const it of children){
            if (it.title === e.target.value) {
                flag = true;
                break;
            }
        }
        setAdd(prev => ({ ...prev, error: flag, input: e.target.value }));
    }, [add, findNode, nodes]);

    const clearDelete = () => setDelete({ open: false, node: null });
    const handleDelete = useCallback(() => {
        const { node } = _delete;
        if (!node?.title) return;
        const { title } = node;
        const nodeFind = findNode(node.key as string);

        deleteNote({ username: username, noteId: node.key as string })[0]
            .then(res => {
                if (!res.ok) {
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
            .catch(() => api.error(`${title} 刪除失敗`));

        clearDelete();
    }, [_delete, api, deleteNote, findNode, navigate, remove, username]);

    const clearCancelCollab = () => setCancelCollab({ open: false, node: null });
    const handleCancelCollab = useCallback(() => {
        const { node } = cancelCollab;
        if (!node?.title || !node?.url) return;
        const { title, url } = node;
        const [id, host] = url.split("/");

        const master = decodeBase64(host);
        cancelCollborate({ username: username, noteId: id, masterName: master })[0]
            .then(res => {
                if (!res.ok) {
                    api.error(`${title} 取消失敗`);
                }
                else {
                    if(master !== username){
                        navigate("..", {replace: true, relative: "route"});
                    }
                    else{
                        update(id, { url: undefined });
                        navigate(id, { replace: true });
                    }
                    
                    api.success(`${title} 取消成功`);
                }
            })
            .catch(() => {
                api.error(`${title} 取消失敗`);
            });

        clearCancelCollab();
    }, [api, cancelCollab, cancelCollborate, navigate, update, username]);

    const deleteTitle = useMemo(() => {
        const { node } = _delete;
        return node?.title ? node?.title : "";
    }, [_delete]);

    const cancelCollabTitle = useMemo(() => {
        const { node } = cancelCollab;
        return node?.title ? node?.title : "";
    }, [cancelCollab]);

    return {
        add: (node: NoteDataNode | null) => setAdd(prev => ({ ...prev, open: true, error: false, node: node })),
        remove: (node: NoteDataNode | null) => setDelete(() => ({ open: true, node: node })),
        cancelCollab: (node: NoteDataNode | null) => setCancelCollab(() => ({ open: true, node: node })),
        contextHolder: <>
            <Modal open={add.open} title="輸入名稱" okText="確認" cancelText="取消"
                onCancel={clearAdd} onOk={handleAdd}>
                <div style={{ position: "relative" }}>
                    <Input value={add.input} placeholder="請輸入..."
                        onChange={handleAddInputChange}
                        status={add.error ? "error" : undefined} />
                    <Typography.Text type="danger"
                        style={{
                            position: "absolute", top: "100%", left: 0,
                            opacity: !add.error ? 0 : 1,
                            transition: "opacity 250ms ease"
                        }}>
                        在同一層的筆記不能有重複名稱
                    </Typography.Text>
                </div>
            </Modal>

            <Modal open={_delete.open} title={`刪除${deleteTitle}`}
                onCancel={clearDelete} onOk={handleDelete}
                okText="是" cancelText="否"
                okButtonProps={{ danger: true, type: "primary" }}
                cancelButtonProps={{ danger: true, type: "default" }}>
                <Typography.Text>{`是否刪除${deleteTitle}`}</Typography.Text>
            </Modal>

            <Modal open={cancelCollab.open} title={`取消${cancelCollabTitle}的協作`}
                okText="是" cancelText="否" onOk={handleCancelCollab} onCancel={clearCancelCollab}
                okButtonProps={{ danger: true, type: "primary" }}
                cancelButtonProps={{ danger: true, type: "default" }}>
                <Typography.Text>{`是否取消${cancelCollabTitle}的協作`}</Typography.Text>
            </Modal>
            {contextHolder}
        </>,
    }
}