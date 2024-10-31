import { Tabs, TabsProps, Input, Button, Space } from "antd";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { $createParagraphNode, COMMAND_PRIORITY_CRITICAL, LexicalCommand, LexicalNode, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AiOutlineFileImage, AiOutlineUpload } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { useCookies } from "react-cookie";
import { useNodes } from "../../../User/SideBar/NoteTree/store";
import { useParams } from "react-router-dom";
import { $createImageNode } from "../../nodes/image";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { PLUSMENU_SELECTED } from "../draggablePlugin/command";
import Modal from "../../ui/modal";

function createFormData(data: Record<string, any>) {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    return formData;
}
export const OPEN_IMAGE_MODAL: LexicalCommand<void> = createCommand();
const ImageModal = () => {

    const [editor] = useLexicalComposerContext();
    const fileRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [{ username }] = useCookies(["username"]);
    const { id } = useParams();
    const { findNode } = useNodes();
    const [node, setNode] = useState<LexicalNode>();
    const [url, setUrl] = useState("");

    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({ node, value }) => {
        if (value === "image") {
            setOpen(true);
            setNode(node);
        }
        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

    const $insertImage = useCallback((src: string) => {
        const image = $createImageNode(src, "");
        if (!node) {
            $insertNodeToNearestRoot(image);
        }
        else {
            const p = $createParagraphNode();
            node.insertAfter(p);
            p.selectStart().insertNodes([image]);
        }
    }, [node]);

    const handleURL = useCallback(() => {
        if (url.trim().length === 0) return;

        editor.update(() => $insertImage(url));
        setUrl("");
        setOpen(false);
    }, [$insertImage, editor, url]);

    const handleFile = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const image = e.target.files[0];
        const node = findNode(id!);
        const data = createFormData({
            username: username,
            filename: image.name,
            notename: node!.current.title as string,
            content: image
        });

        const src = await fetch(APIs.addFile,
            {
                body: data, method: "POST",
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                },
            }
        )
            .then(res => {
                console.log(res);
                return res.text();
            })

        editor.update(() => $insertImage(src));

        fileRef.current!.value = "";
        setOpen(false);
    }, [$insertImage, editor, findNode, id, username]);

    const items: TabsProps["items"] = useMemo(() => [
        {
            key: "file",
            label: "上傳文件",
            icon: <AiOutlineFileImage />,
            children: <>
                <Button type="primary" block icon={<AiOutlineUpload />} onClick={() => { fileRef.current!.click() }}>上傳</Button>
                <input type="file" accept="image/*" style={{ display: "none" }} ref={fileRef} onChange={handleFile} />
            </>
        },
        {
            key: "url",
            label: "上傳網址",
            icon: <CiEdit />,
            children: <Space.Compact style={{ width: "100%" }}>
                <Input placeholder="https://" autoFocus value={url} onChange={(e) => setUrl(e.target.value)} />
                <Button type="primary" onClick={handleURL}>上傳</Button>
            </Space.Compact>,
        }
    ], [handleFile, handleURL, url]);

    return <Modal open={open} title="上傳圖片" onCancel={() => {setOpen(false); setUrl("")}}>
        <Tabs defaultActiveKey="file" items={items} />
    </Modal>
}

export default ImageModal;