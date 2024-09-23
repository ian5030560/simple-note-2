import { CloseCircleOutlined, ShareAltOutlined, TeamOutlined } from "@ant-design/icons"
import { Button, Space, Input, Modal, message, Typography, theme } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useCookies } from "react-cookie"
import { useNavigate, useParams } from "react-router-dom"
import { decodeBase64, encodeBase64 } from "../../../util/secret"
import useAPI, { APIs } from "../../../util/api"
import useNodes, { NoteDataNode } from "../NoteTree/store"

interface Props {
    open?: boolean
    onCancel: () => void
}
export default function CollaborateModal(prop: Props) {
    const { id, host } = useParams();
    const [{ username }] = useCookies(["username"]);
    const [url, setUrl] = useState<string>();
    const [api, context] = message.useMessage();
    const addCollaborate = useAPI(APIs.addCollaborate);
    const { findNode, update } = useNodes();
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const deleteCollab = useAPI(APIs.deleteCollaborate);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        const node = findNode(id!)?.current as NoteDataNode | undefined;
        const url = node?.url;
        setUrl(url ? `http://localhost:3000/note/${url}` : undefined);
        if (url && !host) navigate(url, { replace: true });

    }, [findNode, host, id, navigate]);

    const requestCollaborate = useCallback(() => {
        const host = encodeBase64(username);
        const url = `${id}/${host}`;

        addCollaborate({ username: username, noteId: id as string, url: url })[0]
            .then(res => res.status === 200)
            .then(ok => {
                if (!ok) return api.error("發起失敗");
                api.success("發起成功");
                const node = findNode(id as string)?.current;
                if (node) {
                    update(node.key as string, { url: url });
                }
            })
            .catch(() => api.error("發起失敗"));

    }, [addCollaborate, api, findNode, id, update, username]);

    const handleCollab = useCallback(() => {
        if (!url) {
            requestCollaborate();
        }
        else {
            navigator.clipboard.writeText(url);
            api.info("已複製到剪貼簿");
        }
    }, [api, requestCollaborate, url]);

    const footer = useMemo(() => {
        const f = [
            <Button key={"request"} icon={!url ? <TeamOutlined /> : <ShareAltOutlined />}
                type="primary" onClick={handleCollab}>
                {!url ? "發起" : "分享"}
            </Button>
        ]

        if (id && host) f.push(<Button key={"cancel"} icon={<CloseCircleOutlined />} danger
            onClick={() => setDeleteOpen(true)}>取消</Button>);

        return f;
    }, [handleCollab, host, id, url]);

    const handleDelete = useCallback(() => {
        deleteCollab({username: username, noteId: id!, masterName: decodeBase64(host!)})[0]
        .then(res => {
            if(res.ok){
                api.success("取消成功");
            }
            else{
                api.error("取消失敗");
            }
        });

        setDeleteOpen(false);
    }, [api, deleteCollab, host, id, username]);

    return <>
        <Modal open={prop.open} footer={footer} title="協作" onCancel={prop.onCancel}>
            <Input disabled value={url} styles={{ input: { color: token.colorText } }} />
        </Modal>
        <Modal open={deleteOpen} title="取消協作" okText="是" cancelText="否" okButtonProps={{ danger: true }}
            onCancel={() => setDeleteOpen(false)} onOk={handleDelete} closable={false}>
            <Typography.Text>是否取消該筆記的協作功能</Typography.Text>
        </Modal>
        {context}
    </>
}