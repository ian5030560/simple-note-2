import { Button, Input, Space, Tabs, TabsProps } from "antd";
import Modal from "./modal";
import { useMemo, useRef, useState } from "react";
import { FileEarmarkImageFill, PencilSquare, Upload } from "react-bootstrap-icons";

interface UploadModalProps {
    open?: boolean;
    title?: string;
    onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUploadURL: (url?: string) => void;
    onCancel: () => void;
    accept?: string;
}
export default function UploadModal(props: UploadModalProps) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [url, setUrl] = useState<string>();

    const items: TabsProps["items"] = useMemo(() => [
        {
            key: "file", label: "上傳文件",
            icon: <FileEarmarkImageFill />,
            children: <>
                <Button type="primary" block icon={<Upload />} onClick={() => { fileRef.current!.click() }}>上傳</Button>
                <input type="file" accept={props.accept} style={{ display: "none" }} ref={fileRef} onChange={props.onUploadFile} />
            </>
        },
        {
            key: "url", label: "上傳網址",
            icon: <PencilSquare />,
            children: <Space.Compact style={{ width: "100%" }}>
                <Input placeholder="https://" autoFocus value={url} onChange={(e) => setUrl(e.target.value)} />
                <Button type="primary" icon={<Upload />} onClick={() => props.onUploadURL(url)}>上傳</Button>
            </Space.Compact>,
        }
    ], [props, url]);

    return <Modal open={props.open} title={props.title} onCancel={() => { props.onCancel(); setUrl(undefined) }}>
        <Tabs defaultActiveKey="file" items={items} />
    </Modal>
}