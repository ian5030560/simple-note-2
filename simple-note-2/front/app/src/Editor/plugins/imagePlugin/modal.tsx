import { Tabs, TabsProps, Input, Button, Space, InputRef } from "antd";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { $createParagraphNode, LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AiOutlineFileImage, AiOutlineUpload } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import Modal from "../../ui/modal";
import { useCookies } from "react-cookie";
import { useNodes } from "../../../User/SideBar/NoteTree/store";
import { useParams } from "react-router-dom";
import useMenuFocused from "../draggablePlugin/store";
import { $createImageNode } from "../../nodes/image";
import { $insertNodeToNearestRoot } from "@lexical/utils";

export const OPEN_IMAGE_MODAL: LexicalCommand<void> = createCommand();
const ImageModal = () => {

    const [editor] = useLexicalComposerContext();
    const fileRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [{ username }] = useCookies(["username"]);
    const { id } = useParams();
    const { findNode } = useNodes();
    const { node } = useMenuFocused();
    const [url, setUrl] = useState("");

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

        const data = new FormData();
        const node = findNode(id!);

        data.append("username", username);
        data.append("filename", image.name);
        data.append("notename", node!.current.title as string);
        data.append("content", image);

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

    return <Modal command={OPEN_IMAGE_MODAL} open={open} title="上傳圖片" onOpen={() => setOpen(true)}
        onClose={() => {
            setOpen(false);
            setUrl("");
        }}>
        <Tabs defaultActiveKey="file" items={items} />
    </Modal>
}

export default ImageModal;