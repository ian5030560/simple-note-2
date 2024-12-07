import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import VideoNode, { $createVideoNode, $isVideoNode } from "../nodes/video";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import { useValidateNodeClasses } from "../utils";
import { mergeRegister } from "@lexical/utils";
import { RAISE_ERROR } from "./errorPlugin";
import UploadModal from "../ui/uploadModal";
import { FilePluginProps } from "../types";

export default function VideoModalPlugin(props: FilePluginProps) {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<LexicalNode>();

    useValidateNodeClasses([VideoNode]);

    useEffect(() => mergeRegister(
        editor.registerCommand(PLUSMENU_SELECTED, ({ node, keyPath }) => {
            if (keyPath[0] === "file" && keyPath[1] === "video") {
                setNode(node);
                setOpen(true);
            }
            return false;
        }, COMMAND_PRIORITY_CRITICAL),
        editor.registerMutationListener(VideoNode, (mutations, { prevEditorState }) => {
            prevEditorState.read(() => {
                for (const [key, mutation] of mutations.entries()) {
                    if (mutation !== "destroyed") return;
                    const node = $getNodeByKey(key);
                    if ($isVideoNode(node)) {
                        try {
                            props.destroyFile(node);
                        }
                        catch (err) {
                            if (err instanceof Error) {
                                editor.dispatchCommand(RAISE_ERROR, err);
                            }
                        }
                    }
                }
            })
        })
    ), [editor, props]);


    const $insertVideo = useCallback((src: string) => {
        const video = $createVideoNode(500, 300, src);
        if (!node) {
            $insertNodeToNearestRoot(video);
        }
        else {
            node.insertAfter(video);
        }
    }, [node]);

    const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpen(false);

        if (!e.target.files) return;
        const file = e.target.files![0];

        try {
            const src = await props.insertFile(file);
            editor.update(() => $insertVideo(src));
        }
        catch (err) {
            if (err instanceof Error) {
                editor.dispatchCommand(RAISE_ERROR, err);
            }
        }
    }, [$insertVideo, editor, props]);

    const handleURL = useCallback((url?: string) => {
        setOpen(false);
        if (url?.trim().length === 0) return;
        editor.update(() => $insertVideo(url!));
    }, [$insertVideo, editor]);

    return <UploadModal open={open} title="上傳影片" accept="video/mp4,video/x-m4v,video/*"
        onUploadFile={handleFile} onUploadURL={handleURL} onCancel={() => setOpen(false)} />
}