import { Tabs, TabsProps, Input, Button, Space } from "antd";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { $createParagraphNode, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createImageNode } from "../../nodes/image";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { PLUSMENU_SELECTED } from "../draggablePlugin/command";
import Modal from "../../ui/modal";
import { RAISE_ERROR } from "../errorPlugin";
import { FileEarmarkImageFill, PencilSquare, Upload } from "react-bootstrap-icons";

interface ImageModalProps{
    insertFile: (file: File) => string | Promise<string>;
}
const ImageModal = (props: ImageModalProps) => {

    const [editor] = useLexicalComposerContext();
    const fileRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
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
        try{
            const src = await props.insertFile(image);
            editor.update(() => $insertImage(src));

            fileRef.current!.value = "";
            setOpen(false);
        }
        catch(err){
            if(err instanceof Error){
                editor.dispatchCommand(RAISE_ERROR, err);
            }
        }
    }, [$insertImage, editor, props]);

    const items: TabsProps["items"] = useMemo(() => [
        {
            key: "file",
            label: "上傳文件",
            icon: <FileEarmarkImageFill />,
            children: <>
                <Button type="primary" block icon={<Upload />} onClick={() => { fileRef.current!.click() }}>上傳</Button>
                <input type="file" accept="image/*" style={{ display: "none" }} ref={fileRef} onChange={handleFile} />
            </>
        },
        {
            key: "url",
            label: "上傳網址",
            icon: <PencilSquare />,
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