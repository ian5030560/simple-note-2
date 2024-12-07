import { $getNodeByKey, $getRoot, $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, LexicalNode, MutationListener } from "lexical";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import BlockImageNode, { $createBlockImageNode } from "../nodes/image/block";
import InlineImageNode, { $createInlineImageNode } from "../nodes/image/inline";
import UploadModal from "../ui/uploadModal";
import { $contains, useValidateNodeClasses } from "../utils";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import { RAISE_ERROR } from "./errorPlugin";
import { FilePluginProps } from "../types";
import { $isImageNode } from "../nodes/image";

export default function ImageModalPlugin(props: FilePluginProps) {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<LexicalNode>();
    const [inline, setInline] = useState(false);

    useValidateNodeClasses([BlockImageNode, InlineImageNode]);

    useEffect(() => {
        const handleDelete: MutationListener = (mutations, { prevEditorState }) => {
            prevEditorState.read(() => {
                Array.from(mutations.entries()).forEach(([key, type]) => {
                    if (type !== "destroyed") return;
                    const image = $getNodeByKey(key);
                    if ($isImageNode(image)) {
                        try {
                            props.destroyFile?.(image);
                        }
                        catch (err) {
                            if (err instanceof Error) {
                                editor.dispatchCommand(RAISE_ERROR, err);
                            }
                        }
                    }
                })
            })
        }
        return mergeRegister(
            editor.registerCommand(PLUSMENU_SELECTED, ({ node, keyPath }) => {
                if (keyPath[0] === "file" && keyPath[1] === "image") {
                    setOpen(true);
                    setNode(node);
                    setInline(keyPath[2] === "inline");
                }
                return false;
            }, COMMAND_PRIORITY_CRITICAL),
            editor.registerMutationListener(BlockImageNode, handleDelete),
            editor.registerMutationListener(InlineImageNode, handleDelete)
        )
    }, [editor, props]);

    const clear = useCallback(() => {
        setOpen(false);
        setInline(false);
        setNode(undefined);
    }, []);


    const $insertInline = useCallback((src: string, alt: string) => {
        const image = $createInlineImageNode(src, alt, "left");
        const selection = $getSelection();
        if(!$isRangeSelection(selection)){
            $getRoot().selectEnd().insertParagraph()?.selectStart().insertNodes([image]);
        }
        else{
            const offset = selection.focus.offset;
            const focus = selection.focus.getNode();

            if (!node || $contains(node, focus)) {
                console.log(0);
                focus.select(offset).insertNodes([image]);
            }
            else {
                console.log(1);
                node.selectEnd().insertNodes([image]);
            }
        }
    }, [node]);

    const $insertBlock = useCallback((src: string, alt: string) => {
        const image = $createBlockImageNode(src, alt);
        node?.insertAfter(image);
    }, [node]);

    const $insertImage = useCallback((src: string) => {
        const ALT = "圖片無法顯示";
        if(inline){
            $insertInline(src, ALT);
        }
        else{
            $insertBlock(src, ALT);
        }
    }, [inline, $insertBlock, $insertInline]);

    const handleURL = useCallback((url?: string) => {
        clear();
        if (url?.trim().length === 0) return;
        editor.update(() => $insertImage(url!));
    }, [$insertImage, clear, editor]);

    const handleFile = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        clear();
        if (!e.target.files) return;

        const image = e.target.files[0];
        try {
            const src = await props.insertFile(image);
            editor.update(() => $insertImage(src));
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err);
                editor.dispatchCommand(RAISE_ERROR, err);
            }
        }
    }, [$insertImage, clear, editor, props]);

    return <UploadModal open={open} title="上傳圖片" accept="image/*"
        onUploadFile={handleFile} onUploadURL={handleURL} onCancel={clear} />
}