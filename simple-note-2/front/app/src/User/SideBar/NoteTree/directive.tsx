import { Input, message, Modal, Typography } from "antd";
import { useCallback, useMemo, useState } from "react"
import useAPI from "../../../util/api";
import { useNavigate } from "react-router-dom";
import { uuid } from "../../../util/uuid";
import useNoteManager, { NoteDataNode } from "./useNoteManager";

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
export default function useDirective(username: string) {
    const [add, setAdd] = useState<AddState>({ open: false, input: "", error: false, node: null });
    const [_delete, setDelete] = useState<DeleteState>({ open: false, node: null });
    const [cancelCollab, setCancelCollab] = useState<CancelCollabState>({ open: false, node: null });    const { nodes, find, update, add: _add, remove } = useNoteManager();
    const [api, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { note, collab } = useAPI();

    const clearAdd = () => setAdd({ input: "", open: false, node: null, error: false });
    const handleAdd = useCallback(() => {
        const { error, node, input } = add;
        if (error || !input) return;

        const current = node?.key as string || null;
        const previous = (node ? node.children![node.children!.length - 1]?.key : nodes["one"].at(-1)?.key) as string | null;
        const key = uuid();

        note.add(username, key, input, current, previous)
            .then(ok => {
                if (!ok) {
                    throw new Error();
                }
                else {
                    api.success(`${input} 創建成功`);
                    _add({ key, title: input }, current);
                    navigate(key);
                }
            }).catch(() => {
                api.error(`${input} 創建失敗`);
            });

        clearAdd();
    }, [_add, add, api, navigate, nodes, note, username]);

    const handleAddInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { node } = add;
        const children = node ? find(node.key as string)?.children : nodes["one"];
        if (!children) return;

        let flag = false;
        for (const it of children) {
            if (it.title === e.target.value) {
                flag = true;
                break;
            }
        }
        setAdd(prev => ({ ...prev, error: flag, input: e.target.value }));
    }, [add, find, nodes]);

    const clearDelete = () => setDelete({ open: false, node: null });
    const handleDelete = useCallback(() => {
        const { node } = _delete;
        if (!node?.title) return;
        const { title } = node;

        note.delete(username, node.key).then(ok => {
            if (!ok) {
                throw new Error();
            }
            else {
                api.success(`${title} 刪除成功`);
                remove(node!.key as string);
                const children = node!.parent ? find(node!.parent)!.children : nodes["one"];
                const index = children.findIndex(it => it.key === node.key) - 1;
                const prev = children[index]?.key;
                navigate(prev ? prev : node.parent!, {replace: true});
            }
        }).catch(() => {
            api.error(`${title} 刪除失敗`);
        });

        clearDelete();
    }, [_delete, api, find, navigate, nodes, note, remove, username]);

    const clearCancelCollab = () => setCancelCollab({ open: false, node: null });
    const handleCancelCollab = useCallback(() => {
        const { node } = cancelCollab;
        if (!node?.title || !node?.url) return;
        const { title, url } = node;
        const [id, host] = url.split("/");

        const master = decodeURI(host);
        collab.delete(username, id, master).then(ok => {
            if (!ok) {
                throw new Error();
            }
            else {
                remove(id + host, "multiple");

                if (master !== username) {
                    navigate("..", { replace: true, relative: "route" });
                }
                else {
                    update(id, { url: undefined });
                    navigate(id, { replace: true });
                }

                api.success(`${title} 取消成功`);
            }
        }).catch(() => {
            api.error(`${title} 取消失敗`);
        });

        clearCancelCollab();
    }, [api, cancelCollab, collab, navigate, remove, update, username]);

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