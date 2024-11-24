import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { useCallback, useEffect, useState } from "react";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { mergeRegister } from "@lexical/utils";
import DocumentNode, { $isDocumentNode, $createDocumentNode } from "../nodes/document";
import { useValidateNodeClasses } from "../utils";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import { RAISE_ERROR } from "./errorPlugin";
import UploadModal from "../ui/uploadModal";
import { uuid } from "../../util/uuid";
import { FilePluginProps } from "../types";

export default function DocumentModal(props: FilePluginProps) {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<LexicalNode>();

    useValidateNodeClasses([DocumentNode]);

    useEffect(() => mergeRegister(
        editor.registerCommand(PLUSMENU_SELECTED, ({ node, value }) => {
            if (value !== "document") return false;
            setNode(node);
            setOpen(true);
            return false;
        }, COMMAND_PRIORITY_CRITICAL),
        editor.registerMutationListener(DocumentNode, (mutations, { prevEditorState }) => {
            prevEditorState.read(() => {
                for (const [key, mutation] of mutations) {
                    if (mutation !== "destroyed") return;

                    const node = $getNodeByKey(key);
                    if ($isDocumentNode(node)) {
                        try{
                            props.destroyFile(node);
                        }
                        catch(err){
                            if(err instanceof Error){
                                editor.dispatchCommand(RAISE_ERROR, err);
                            }
                        }
                    }
                }
            })
        })
    ), [editor, props]);

    const $insertDocument = useCallback((src: string, name: string) => {
        let doc = $createDocumentNode(src, name);
    
        if (!node) {
            $insertNodeToNearestRoot(doc);
        }
        else {
            node.insertAfter(doc);
        }
    }, [node]);

    const handleURL = useCallback((url?: string) => {
        setOpen(false);
        if (!url || url.trim().length === 0) return;
        
        if(url.startsWith("data:") || url.startsWith("object:")){
            editor.update(() => $insertDocument(url, uuid()));
        }
        else{
            const urlObj = new URL(url);
            const filename = urlObj.pathname.split("/").pop();
            editor.update(() => $insertDocument(url, filename ?? uuid()));
        }
    }, [$insertDocument, editor]);

    const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpen(false);
        if (!e.target || !e.target.files) return;
        const file = e.target.files[0];

        try{
            const src = await props.insertFile(file);
            const name = file.name;
    
            editor.update(() => $insertDocument(src, name));
        }
        catch(err){
            if(err instanceof Error){
                editor.dispatchCommand(RAISE_ERROR, err);
            }
        }
    }, [$insertDocument, editor, props]);

    return <UploadModal open={open} title="上傳文件" onCancel={() => setOpen(false)}
        onUploadFile={handleFile} onUploadURL={handleURL}
    />
}