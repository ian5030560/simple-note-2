import { Modal, Tabs, TabsProps, Input, Button, Space, InputRef } from "antd";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AiOutlineFileImage, AiOutlineUpload } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { INSERT_IMAGE } from "./plugin";

export const OPEN_IMAGE_MODAL: LexicalCommand<boolean> = createCommand();

const ImageModal: React.FC = () => {

    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const urlRef = useRef<InputRef>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return editor.registerCommand(OPEN_IMAGE_MODAL, (payload: boolean) => {
            setOpen(payload);
            return false;
        }, 4);
    }, [editor]);


    const handleURL = useCallback(() => {
        let url = urlRef.current!.input!.value;

        editor.dispatchCommand(INSERT_IMAGE, { alt: "", src: url });
        urlRef.current!.input!.value = "";
        setOpen(false);
    }, [editor]);

    const handleFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files![0];
        let src = URL.createObjectURL(file);
        editor.dispatchCommand(INSERT_IMAGE, { alt: "", src: src });
        fileRef.current!.value = "";
        setOpen(false);
    }, [editor]);

    const items: TabsProps["items"] = useMemo(() => [
        {
            key: "file",
            label: "Upload File",
            icon: <AiOutlineFileImage />,
            children: <>
                <Button
                    type="primary"
                    style={{ width: "100%" }}
                    icon={<AiOutlineUpload />}
                    onClick={() => {fileRef.current!.click()}}
                >
                    Upload File
                </Button>
                <input type="file" accept="image/*" style={{display: "none"}} ref={fileRef} onChange={handleFile}/>
            </>
        },
        {
            key: "url",
            label: "Upload URL",
            icon: <CiEdit />,
            children: <Space.Compact style={{ width: "100%" }}>
                <Input placeholder="https://" autoFocus ref={urlRef} />
                <Button type="primary" onClick={handleURL}>upload</Button>
            </Space.Compact>,
        }
    ], [handleFile, handleURL]);

    return <Modal title="Upload Image" open={open}
        footer={null} onCancel={() => setOpen(false)}>
        <Tabs defaultActiveKey="file" items={items} />
    </Modal>;
}

export default ImageModal;