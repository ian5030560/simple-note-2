import { Button } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { MdOutlineFileUpload } from "react-icons/md";
import { $createVideoNode } from "../nodes/video";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import Modal from "../ui/modal";

export default function VideoPlugin(){
    const [editor] = useLexicalComposerContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<LexicalNode>();

    useEffect(() => {
        return editor.registerCommand(PLUSMENU_SELECTED, ({ node, value }) => {
            if (value === "video") {
                setNode(node);
                setOpen(true);
            }
            return false;
        }, COMMAND_PRIORITY_CRITICAL);
    }, [editor]);


    const WIDTH = useMemo(() => {
        const rect = editor.getRootElement()?.getBoundingClientRect();
        return rect ? rect.width / 2 : 500;
    }, [editor]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        editor.update(() => {
            const file = e.target.files![0];

            const src = URL.createObjectURL(file);
            const video = $createVideoNode(WIDTH, 300, src);

            if (!node) {
                $insertNodeToNearestRoot(video);
            }
            else {
                node.insertAfter(video);
            }
        });


        setOpen(false);
    }, [WIDTH, editor, node]);

    return <Modal title="上傳影片" footer={null} open={open} onCancel={() => setOpen(false)} centered>
        <Button block icon={<MdOutlineFileUpload />} type="primary" onClick={() => inputRef.current?.click()}>上傳</Button>
        <input type="file" accept="video/mp4,video/x-m4v,video/*" style={{ display: "none" }} ref={inputRef} onChange={handleChange} />
    </Modal>
}