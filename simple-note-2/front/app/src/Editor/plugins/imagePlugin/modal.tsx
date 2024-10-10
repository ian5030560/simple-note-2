import { Tabs, TabsProps, Input, Button, Space, InputRef } from "antd";
import React, { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AiOutlineFileImage, AiOutlineUpload } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { INSERT_IMAGE } from ".";
import Modal from "../../ui/modal";
import { useCookies } from "react-cookie";
import { useNodes } from "../../../User/SideBar/NoteTree/store";
import { useParams } from "react-router-dom";

export const OPEN_IMAGE_MODAL: LexicalCommand<boolean> = createCommand();
const ImageModal: React.FC = () => {

    const [editor] = useLexicalComposerContext();
    const urlRef = useRef<InputRef>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [{ username }] = useCookies(["username"]);
    const { id } = useParams();
    const { findNode } = useNodes();

    const handleURL = useCallback(() => {
        const url = urlRef.current!.input!.value;

        editor.dispatchCommand(INSERT_IMAGE, { alt: "", src: url });
        urlRef.current!.input!.value = "";
        setOpen(false);
    }, [editor]);

    const handleFile = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const image = e.target.files[0];

        const data = new FormData();
        const node = findNode(id!);

        data.append("username", username);
        data.append("filename", image.name);
        data.append("notename", node!.current.title as string);
        data.append("content", image!);

        let src = await fetch(APIs.addFile,
            {
                body: data, method: "POST",
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                    // "content-type": "multipart/form-data",
                },
            }
        ).then(res => {
            console.log(res);
            return res.text();
        })
            .catch((err) => {
                console.log(err);
                return "";
            });

        src = "http://" + src.substring(1, src.length - 1);
        // let src = URL.createObjectURL(file);
        editor.dispatchCommand(INSERT_IMAGE, { alt: "", src: src });
        fileRef.current!.value = "";
        setOpen(false);
    }, [editor, findNode, id, username]);

    const items: TabsProps["items"] = useMemo(() => [
        {
            key: "file",
            label: "上傳文件",
            icon: <AiOutlineFileImage />,
            children: <>
                <Button
                    type="primary" block
                    icon={<AiOutlineUpload />}
                    onClick={() => { fileRef.current!.click() }}
                >
                    上傳
                </Button>
                <input type="file" accept="image/*" style={{ display: "none" }} ref={fileRef} onChange={handleFile} />
            </>
        },
        {
            key: "url",
            label: "上傳網址",
            icon: <CiEdit />,
            children: <Space.Compact style={{ width: "100%" }}>
                <Input placeholder="https://" autoFocus ref={urlRef} />
                <Button type="primary" onClick={handleURL}>上傳</Button>
            </Space.Compact>,
        }
    ], [handleFile, handleURL]);

    return <Modal command={OPEN_IMAGE_MODAL} open={open} title="上傳圖片"
        onOpen={() => setOpen(true)} onClose={() => setOpen(false)}>
        <Tabs defaultActiveKey="file" items={items} />
    </Modal>
}

export default ImageModal;