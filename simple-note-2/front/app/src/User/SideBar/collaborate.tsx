import { CloseCircleOutlined, ShareAltOutlined, TeamOutlined } from "@ant-design/icons"
import { Button, Input, Modal, message, Typography, theme } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useAPI from "../../util/api"
import { encodeBase64, decodeBase64 } from "../../util/secret"
import useNoteManager, { NoteDataNode } from "./NoteTree/useNoteManager";

interface CollaborateModalProps {
    open?: boolean;
    onCancel: () => void;
    username: string;
}
export default function CollaborateModal(props: CollaborateModalProps) {
    const { id, host } = useParams();
    const [url, setUrl] = useState<string>();
    const [api, context] = message.useMessage();
    const { collab } = useAPI();
    const { find, update, add, remove } = useNoteManager();
    // const { find, update, add, remove } = useNodes();
    const { token } = theme.useToken();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const node = find(id!) as NoteDataNode | undefined;
        const url = node?.url;
        setUrl(url ? `http://localhost:3000/note/${url}` : undefined);
    }, [find, host, id, navigate]);

    const requestCollaborate = useCallback(() => {
        const { username } = props;
        const host = encodeBase64(username);
        const url = `${id}/${host}`;

        collab.add(username, id!, url)
            .then(res => {
                if (!res.ok) return api.error("發起失敗");
                const node = find(id as string);
                if (!node) {
                    api.error("發起失敗");
                }
                else {
                    update(node.key as string, { url: url });
                    add({ key: node.key + host, title: node.title, url: url }, null, "multiple");
                    navigate(url, { replace: true });
                    api.success("發起成功");
                }
            })
            .catch(() => api.error("發起失敗"));

    }, [add, api, collab, find, id, navigate, props, update]);

    const handleCollab = useCallback(() => {
        if (!url) {
            requestCollaborate();
        }
        else {
            navigator.clipboard.writeText(url);
            api.info("已複製到剪貼簿");
        }
    }, [api, requestCollaborate, url]);

    const footer = useMemo(() => <>
        <Button key={"request"} icon={!url ? <TeamOutlined /> : <ShareAltOutlined />}
            type="primary" onClick={handleCollab}>
            {!url ? "發起" : "分享"}
        </Button>
        {id && host && <Button key={"cancel"} icon={<CloseCircleOutlined />} danger
            onClick={() => setDeleteOpen(true)}>取消</Button>}
    </>, [handleCollab, host, id, url]);

    const handleDelete = useCallback(() => {
        const { username } = props;
        const master = decodeBase64(host!);

        collab.delete(username, id!, master).then(res => {
            if (!res.ok) {
                api.error("取消失敗");
            }
            else {
                const node = find(id!);
                if (!node) {
                    api.success("取消失敗");
                }
                else {
                    update(node.key as string, { url: undefined });
                    remove(node.key + host!, "multiple");
                    navigate(node.key as string, { replace: true });
                    api.success("取消成功");
                }
            }
        });

        setDeleteOpen(false);
    }, [api, collab, find, host, id, navigate, props, remove, update]);

    return <>
        <Modal open={props.open} footer={footer} title="協作" onCancel={props.onCancel}>
            <Input disabled value={url} styles={{ input: { color: token.colorText } }} />
        </Modal>
        <Modal open={deleteOpen} title="取消協作" okText="是" cancelText="否" okButtonProps={{ danger: true }}
            onCancel={() => setDeleteOpen(false)} onOk={handleDelete} closable={false}>
            <Typography.Text>是否取消該筆記的協作功能</Typography.Text>
        </Modal>
        {context}
    </>
}