import { Tabs, TabsProps, Input, Button, Space, InputRef } from "antd";
import React, { ChangeEvent, useCallback, useMemo, useRef } from "react";
import { LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AiOutlineFileImage, AiOutlineUpload } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { INSERT_IMAGE } from "./plugin";
import Modal, { ModalRef } from "../UI/modal";
import { useCookies } from "react-cookie";
import useAPI, { APIs } from "../../../util/api";

export const OPEN_IMAGE_MODAL: LexicalCommand<boolean> = createCommand();
const ImageModal: React.FC = () => {

    const [editor] = useLexicalComposerContext();
    const urlRef = useRef<InputRef>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const ref = useRef<ModalRef>(null);
    const [{ username }] = useCookies(["username"]);
    const addFile = useAPI(APIs.addFile);

    const handleURL = useCallback(() => {
        let url = urlRef.current!.input!.value;

        editor.dispatchCommand(INSERT_IMAGE, { alt: "", src: url });
        urlRef.current!.input!.value = "";
        ref.current?.close();
    }, [editor]);

    const handleFile = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        let file = e.target.files[0];
        
        let src = await addFile({
            username: "user13",
            filename: file.name,
            notename: "note13",
            content: await file.text(),
        }).then(res => res.text());

        src = src.substring(1, src.length - 1);
        
        editor.dispatchCommand(INSERT_IMAGE, { alt: "", src: "http://" + src });
        fileRef.current!.value = "";
        ref.current?.close();
    }, [addFile, editor]);

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