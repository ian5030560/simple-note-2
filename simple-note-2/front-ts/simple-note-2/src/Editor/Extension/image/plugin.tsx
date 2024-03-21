import { $getRoot, $getSelection, $isRangeSelection, $isRootNode, COMMAND_PRIORITY_EDITOR, LexicalCommand, LexicalEditor, createCommand } from "lexical";
import { Plugin } from "../index";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ImageNode, { $createImageNode } from "./node";
import ImageModal from "./modal";
import {mergeRegister} from "@lexical/utils";
import postData from "../../../util/post";

export const INSERT_IMAGE: LexicalCommand<{alt: string, src: string}> = createCommand();

const ImagePlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();

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
                            // postData("http://localhost:8000/delete_file/", {
                            //     username: "user",
                            //     url: "http://localhost:8000/view_file/428220824_717405110214191_1896139774089273018_n.jpg",
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