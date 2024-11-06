import { Button } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { MdOutlineFileUpload } from "react-icons/md";
import VideoNode, { $createVideoNode, $isVideoNode } from "../nodes/video";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import Modal from "../ui/modal";
import { FilePluginProps, useValidateNodeClasses } from "../utils";
import { mergeRegister } from "@lexical/utils";
import { RAISE_ERROR } from "./errorPlugin";

export default function VideoPlugin(props: FilePluginProps) {
    const [editor] = useLexicalComposerContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<LexicalNode>();

    useValidateNodeClasses([VideoNode]);

    useEffect(() => mergeRegister(
        editor.registerCommand(PLUSMENU_SELECTED, ({ node, value }) => {
            if (value === "video") {
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


    const WIDTH = useMemo(() => {
        const rect = editor.getRootElement()?.getBoundingClientRect();
        return rect ? rect.width / 2 : 500;
    }, [editor]);

    const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files![0];

        try {
            const src = await props.insertFile(file);
            editor.update(() => {
                const video = $createVideoNode(WIDTH, 300, src);
                if (!node) {
                    $insertNodeToNearestRoot(video);
                }
                else {
                    node.insertAfter(video);
                }
            });
            setOpen(false);
        }
        catch(err){
            if(err instanceof Error){
                editor.dispatchCommand(RAISE_ERROR, err);
            }
        }
    }, [WIDTH, editor, node, props]);

    return <Modal title="上傳影片" footer={null} open={open} onCancel={() => setOpen(false)} centered>
        <Button block icon={<MdOutlineFileUpload />} type="primary" onClick={() => inputRef.current?.click()}>上傳</Button>
        <input type="file" accept="video/mp4,video/x-m4v,video/*" style={{ display: "none" }} ref={inputRef} onChange={handleChange} />
    </Modal>
}