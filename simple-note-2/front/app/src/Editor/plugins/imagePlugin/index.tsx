import { $getNodeByKey } from "lexical";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ImageModal from "./modal";
import { mergeRegister } from "@lexical/utils";
import ImageNode, { $isImageNode } from "../../nodes/image";
import { FilePluginProps, useValidateNodeClasses } from "../../utils";
import { RAISE_ERROR } from "../ErrorPlugin";

export default function ImagePlugin(props: FilePluginProps) {
    const [editor] = useLexicalComposerContext();
    useValidateNodeClasses([ImageNode]);

    useEffect(() => {
        return mergeRegister(
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

    return <ImageModal insertFile={props.insertFile}/>;
}