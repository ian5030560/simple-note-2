import { $getRoot, $getSelection, $isRangeSelection, $isRootNode, COMMAND_PRIORITY_EDITOR, LexicalCommand, LexicalEditor, createCommand } from "lexical";
import { Plugin } from "../index";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ImageNode, { $createImageNode } from "./node";
import ImageModal from "./modal";
import {mergeRegister} from "@lexical/utils";
import useAPI, { APIs } from "../../../util/api";

export const INSERT_IMAGE: LexicalCommand<{alt: string, src: string}> = createCommand();

const ImagePlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const deleteFile = useAPI(APIs.deleteFile);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(INSERT_IMAGE, (payload) => {

                    editor.update(() => {
                        const selection = $getSelection();
                        const node = $createImageNode(payload.src, payload.src);
                        if($isRangeSelection(selection)){
                            if($isRootNode(selection.anchor.getNode())){
                                selection.insertParagraph();
                            }
                            selection.insertNodes([node]);
                        }
                        else{
                            $getRoot().selectEnd().insertNodes([node]);
                        }
                    });

                    return true;
            }, COMMAND_PRIORITY_EDITOR),

            editor.registerMutationListener(ImageNode, (mutations) => {
                editor.getEditorState().read(() => {
                    Array.from(mutations.entries()).forEach(([key, type]) => {
                        if(type === "destroyed"){
                            let element = editor.getElementByKey(key) as HTMLImageElement;
                            // deleteFile({
                            //     username: "user",
                            //     url: element.src,
                            // })
                        }
                    })
                })
            })
        )
    }, [editor]);

    return <ImageModal/>;
}

export default ImagePlugin;