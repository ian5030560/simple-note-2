import { Tabs, TabsProps, Input, Button, Space, InputRef } from "antd";
import React, { ChangeEvent, useCallback, useMemo, useRef } from "react";
import { LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AiOutlineFileImage, AiOutlineUpload } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { INSERT_IMAGE } from "./plugin";
import Modal, { ModalRef } from "../UI/modal";
import { useCookies } from "react-cookie";

export const OPEN_IMAGE_MODAL: LexicalCommand<boolean> = createCommand();
const ImageModal: React.FC = () => {

    const [editor] = useLexicalComposerContext();
    const urlRef = useRef<InputRef>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const ref = useRef<ModalRef>(null);
    const [{ username }] = useCookies(["username"]);

    const handleURL = useCallback(() => {
        let url = urlRef.current!.input!.value;

        editor.dispatchCommand(INSERT_IMAGE, { alt: "", src: url });
        urlRef.current!.input!.value = "";
        ref.current?.close();
    }, [editor]);

    const handleFile = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        let file = e.target.files[0];

        let data = new FormData();
        data.append("username", "user01");
        data.append("filename", file.name);
        data.append("notename", "note1");
        data.append("content", file);

        let src = await fetch("http://localhost:8000/newMediaFile/",
            {
                body: data, method: "POST", 
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                    "content-type": "multipart/form-data",
                },
            }
        ).then(res => res.text());

        src = src.substring(1, src.length - 1);

        editor.dispatchCommand(INSERT_IMAGE, { alt: "", src: "http://" + src });
        fileRef.current!.value = "";
        ref.current?.close();
    }, [editor]);

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

    return <Modal command={OPEN_IMAGE_MODAL} footer={null} ref={ref}>
        <Tabs defaultActiveKey="file" items={items} />
    </Modal>
}

export default ImageModal;