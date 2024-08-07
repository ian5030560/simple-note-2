import { $getNodeByKey, $getRoot, $getSelection, $isRangeSelection, $isRootNode, COMMAND_PRIORITY_EDITOR, LexicalCommand, LexicalEditor, createCommand } from "lexical";
import { Plugin } from "../index";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ImageNode, { $createImageNode, $isImageNode } from "./node";
import ImageModal from "./modal";
import {mergeRegister} from "@lexical/utils";
import useAPI, { APIs } from "../../../util/api";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

export const INSERT_IMAGE: LexicalCommand<{alt: string, src: string}> = createCommand();

const ImagePlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const deleteFile = useAPI(APIs.deleteFile);
    const {file} = useParams();
    const [{username}] = useCookies(["username"]);

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

            editor.registerMutationListener(ImageNode, (mutations, payload) => {
                payload.prevEditorState.read(() => {
                    Array.from(mutations.entries()).forEach(([key, type]) => {
                        if(type === "destroyed"){
                            let image = $getNodeByKey(key)
                            if($isImageNode(image)){
                                deleteFile({
                                    username: username,
                                    url: image.getSrc(),
                                    note_title_id: file as string,
                                })
                            }
                        }
                    })
                })
            })
        )
    }, [editor]);

    return <ImageModal/>;
}

export default ImagePlugin;