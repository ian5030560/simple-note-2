import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "antd";
import { $getNodeByKey, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import DocumentNode, { $createDocumentNode, $isDocumentNode } from "../../nodes/document";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { PLUSMENU_SELECTED } from "../draggablePlugin/command";
import Modal from "../../ui/modal";
import { FilePluginProps, useValidateNodeClasses } from "../../utils";
import { mergeRegister } from "@lexical/utils";
import { RAISE_ERROR } from "../errorPlugin";
import { Upload } from "react-bootstrap-icons";

export default function DocumentModal(props: FilePluginProps) {
    const [editor] = useLexicalComposerContext();
    const inputRef = useRef<HTMLInputElement>(null);
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

    const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!e.target || !e.target.files) return;
        const file = e.target.files[0];
        // const [type] = file.name.split(".").reverse();

        try{
            const src = await props.insertFile(file);
            const name = file.name;
    
            editor.update(async () => {
                let doc = $createDocumentNode(src, name);
                // switch(type){
                //     case "pdf":
                //         doc = $createPDFNode(800, 400, src);
                //         break;
                //     default:
                //         doc = $createDocumentNode(src, name);
                // }
    
                if (!node) {
                    $insertNodeToNearestRoot(doc);
                }
                else {
                    node.insertAfter(doc);
                }
            });
    
            setOpen(false);
        }
        catch(err){
            if(err instanceof Error){
                editor.dispatchCommand(RAISE_ERROR, err);
            }
        }
    }, [editor, node, props]);

    return <Modal open={open} title="上傳文件" onCancel={() => setOpen(false)}>
        <Button block type="primary" icon={<Upload />} onClick={() => inputRef.current?.click()}>上傳</Button>
        <input type="file" style={{ display: "none" }} ref={inputRef} onChange={(e) => handleChange(e)} />
    </Modal>
}