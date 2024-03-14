import { Button, Modal } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalCommand, createCommand } from "lexical";
import VideoNode, { $createVideoNode, VideoNodeProp } from "./node";
import { mergeRegister, $insertNodeToNearestRoot } from "@lexical/utils";
import { MdOutlineFileUpload } from "react-icons/md";

export const INSERT_VIDEO: LexicalCommand<Omit<VideoNodeProp, "className" | "nodeKey" | "format">> = createCommand();

export const OPEN_VIDEO_MODAL: LexicalCommand<void> = createCommand();
const VideoModal = () => {
    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!editor.hasNodes([VideoNode])) {
            throw new Error('VideoPlugin: VideoNode not registered on editor');
        }

        return mergeRegister(
            editor.registerCommand(OPEN_VIDEO_MODAL, () => {
                setOpen(true);
                return false;
            }, 4),

            editor.registerCommand(INSERT_VIDEO, (payload) => {
                const node = $createVideoNode(payload.width, payload.height, payload.src);
                $insertNodeToNearestRoot(node);
                return true
            }, 0)
        )
    }, [editor]);

    const WIDTH = useMemo(() => {
        let rect = editor.getRootElement()?.getBoundingClientRect();
        return rect ? rect.width / 2 : 500;
    }, [editor]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        let file = e.target.files[0];

        let src = URL.createObjectURL(file);
        editor.dispatchCommand(INSERT_VIDEO, { width: WIDTH, height: 300, src: src });

        setOpen(false);
    }, [WIDTH, editor]);

    return <Modal open={open} footer={null} title="上傳影片" centered onCancel={() => setOpen(false)}>
        <Button block icon={<MdOutlineFileUpload/>} type="primary" onClick={() => ref.current?.click()}>上傳</Button>
        <input type="file" accept="video/mp4,video/x-m4v,video/*" style={{ display: "none" }} ref={ref} onChange={handleChange} />
    </Modal>
}

const VideoPlugin = () => <VideoModal />;

export default VideoPlugin;