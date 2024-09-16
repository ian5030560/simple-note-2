import { ShareAltOutlined, TeamOutlined } from "@ant-design/icons"
import { Button, Space, Input, Modal, message } from "antd"
import { useCallback, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useParams } from "react-router-dom"
import { encodeBase64 } from "../../../util/secret"
import useAPI, { APIs } from "../../../util/api"
import useNodes from "../NoteTree/store"

interface CollaborateProps {
    open?: boolean
    onCancel: () => void
}
export default function CollaborateModal(prop: CollaborateProps) {
    const { id } = useParams();
    const [{ username }] = useCookies(["username"]);
    const [url, setUrl] = useState<string>();
    const [api, context] = message.useMessage();
    const addCollaborate = useAPI(APIs.addCollaborate);
    const { nodes, findNode } = useNodes();

    useEffect(() => {
        if (id) setUrl(undefined);
    }, [id]);

    const requestCollaborate = useCallback(() => {
        const host = encodeBase64(username);
        const url = `/${host}/${id}`;
        
        addCollaborate({ username: username, noteId: id as string, url: url })[0]
            .then(res => res.status === 200)
            .then(ok => {
                if (!ok) return api.error("發起失敗");
                setUrl(url);
                api.success("發起成功");
                const node = findNode(id as string)?.current;
                if(node){
                    node.url = url;
                }
            })
            .catch(() => api.error("發起失敗"));

    }, [addCollaborate, api, id, nodes, username]);

    const handleClick = useCallback(() => {
        if (!url) {
            requestCollaborate();
        }
        else {
            navigator.clipboard.writeText(url);
            api.info("已複製到剪貼簿");
        }
    }, [api, requestCollaborate, url]);

    return <>
        <Modal open={prop.open} footer={null} title="發起協作" onCancel={prop.onCancel}>
            <Space.Compact block>
                <Input disabled value={url} styles={{ input: { color: "ButtonText" } }} />
                <Button icon={!url ? <TeamOutlined /> : <ShareAltOutlined />}
                    type="primary" onClick={handleClick}>
                    {!url ? "發起" : "分享"}
                </Button>
            </Space.Compact>
        </Modal>
        {context}
    </>
}