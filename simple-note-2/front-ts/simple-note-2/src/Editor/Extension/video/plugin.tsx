import { Button } from "antd";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalCommand, createCommand } from "lexical";
import VideoNode, { $createVideoNode, VideoNodeProp } from "./node";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { MdOutlineFileUpload } from "react-icons/md";
import Modal, { ModalRef } from "../UI/modal";

export const INSERT_VIDEO: LexicalCommand<Omit<VideoNodeProp, "className" | "nodeKey" | "format">> = createCommand();

export const OPEN_VIDEO_MODAL: LexicalCommand<void> = createCommand();
const VideoModal = () => {
    const [editor] = useLexicalComposerContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const ref = useRef<ModalRef>(null);

    useEffect(() => {
        if (!editor.hasNodes([VideoNode])) {
            throw new Error('VideoPlugin: VideoNode not registered on editor');
        }

        return editor.registerCommand(INSERT_VIDEO, (payload) => {
            const node = $createVideoNode(payload.width, payload.height, payload.src);
            $insertNodeToNearestRoot(node);
            return true
        }, 0)

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

        ref.current?.close();
    }, [WIDTH, editor]);


    return <Modal command={OPEN_VIDEO_MODAL} title="上傳影片" ref={ref} footer={null}>
        <Button block icon={<MdOutlineFileUpload />} type="primary" onClick={() => inputRef.current?.click()}>上傳</Button>
        <input type="file" accept="video/mp4,video/x-m4v,video/*" style={{ display: "none" }} ref={inputRef} onChange={handleChange} />
    </Modal>
}

const VideoPlugin = () => <VideoModal />;

export default VideoPlugin;