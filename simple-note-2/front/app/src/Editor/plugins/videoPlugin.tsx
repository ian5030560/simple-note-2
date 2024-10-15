import { Button } from "antd";
import { useCallback, useMemo, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalCommand, createCommand } from "lexical";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { MdOutlineFileUpload } from "react-icons/md";
import Modal from "../ui/modal";
import VideoNode, { $createVideoNode } from "../nodes/video";
import useMenuFocused from "./draggablePlugin/store";

export const OPEN_VIDEO_MODAL: LexicalCommand<void> = createCommand();
const VideoModal = () => {
    const [editor] = useLexicalComposerContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const { node } = useMenuFocused();

    if (!editor.hasNodes([VideoNode])) {
        throw new Error('VideoPlugin: VideoNode not registered on editor');
    }

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
    
            if(!node){
                $insertNodeToNearestRoot(video);
            }
            else{
                node.insertAfter(video);
            }
        });


        setOpen(false);
    }, [WIDTH, editor, node]);


    return <Modal command={OPEN_VIDEO_MODAL} title="上傳影片" footer={null} open={open}
        onOpen={() => setOpen(true)} onClose={() => setOpen(false)}>
        <Button block icon={<MdOutlineFileUpload />} type="primary" onClick={() => inputRef.current?.click()}>上傳</Button>
        <input type="file" accept="video/mp4,video/x-m4v,video/*" style={{ display: "none" }} ref={inputRef} onChange={handleChange} />
    </Modal>
}

const VideoPlugin = () => <VideoModal />;

export default VideoPlugin;