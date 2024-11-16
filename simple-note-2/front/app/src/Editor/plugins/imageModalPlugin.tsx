import { $createParagraphNode, $getNodeByKey, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils";
import ImageNode, { $isImageNode, $createImageNode } from "../nodes/image";
import UploadModal from "../ui/uploadModal";
import { FilePluginProps, useValidateNodeClasses } from "../utils";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import { RAISE_ERROR } from "./errorPlugin";

export default function ImageModalPlugin(props: FilePluginProps) {
    const [editor] = useLexicalComposerContext();
    const fileRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<LexicalNode>();
    
    useValidateNodeClasses([ImageNode]);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(PLUSMENU_SELECTED, ({ node, value }) => {
                if (value === "image") {
                    setOpen(true);
                    setNode(node);
                }
                return false;
            }, COMMAND_PRIORITY_CRITICAL),
            editor.registerMutationListener(ImageNode, (mutations, {prevEditorState}) => {
                prevEditorState.read(() => {
                    Array.from(mutations.entries()).forEach(([key, type]) => {
                        if (type !== "destroyed") return;
                        const image = $getNodeByKey(key)
                        if ($isImageNode(image)) {
                            try{
                                props.destroyFile?.(image);
                            }
                            catch(err){
                                if(err instanceof Error){
                                    editor.dispatchCommand(RAISE_ERROR, err);
                                }
                            }
                        }
                    })
                })
            })
        )
    }, [editor, props]);

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

    const handleURL = useCallback((url?: string) => {
        setOpen(false);
        if (url?.trim().length === 0) return;
        editor.update(() => $insertImage(url!));
    }, [$insertImage, editor]);

    const handleFile = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        setOpen(false);
        if (!e.target.files) return;

        const image = e.target.files[0];
        try{
            const src = await props.insertFile(image);
            editor.update(() => $insertImage(src));

            fileRef.current!.value = "";
        }
        catch(err){
            if(err instanceof Error){
                editor.dispatchCommand(RAISE_ERROR, err);
            }
        }
    }, [$insertImage, editor, props]);

    return <UploadModal open={open} title="上傳圖片" accept="image/*"
        onUploadFile={handleFile} onUploadURL={handleURL} onCancel={() => setOpen(false)}/>
}