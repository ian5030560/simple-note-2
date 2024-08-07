import { ShareAltOutlined, TeamOutlined } from "@ant-design/icons"
import { Button, Space, Input, Modal, message } from "antd"
import { useCallback, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useParams } from "react-router-dom"
import { encodeBase64 } from "../../../util/secret"
import useAPI, { APIs } from "../../../util/api"

interface CollaborateProps {
    open?: boolean
    onCancel: () => void
}
export default function CollaborateModal(prop: CollaborateProps) {
    const { file } = useParams();
    const [{ username }] = useCookies(["username"]);
    const [url, setUrl] = useState<string>();
    const [api, context] = message.useMessage();
    const addCollaborate = useAPI(APIs.addCollaborate);

    useEffect(() => {
        if (file) setUrl(undefined);
    }, [file]);

    const requestCollaborate = useCallback(() => {
        const encodeUser = encodeBase64(username);
        let url = `/${encodeUser}/${file}`;

        addCollaborate({ username: username, noteId: file as string, url: url })[0]
            .then(res => res.status)
            .then(ok => {
                if (!ok) return api.error("發起失敗");
                setUrl(url);
                api.success("發起成功");
            })
            .catch(() => api.error("發起失敗"));

    }, [addCollaborate, api, file, username]);

    const handleClick = useCallback(() => {
        if (!url) {
            requestCollaborate()
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