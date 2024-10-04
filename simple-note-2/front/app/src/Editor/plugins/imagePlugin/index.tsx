import { $getNodeByKey, $getRoot, $getSelection, $isRangeSelection, $isRootNode, COMMAND_PRIORITY_EDITOR, LexicalCommand, LexicalEditor, createCommand } from "lexical";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ImageModal from "./modal";
import { mergeRegister } from "@lexical/utils";
import useAPI from "../../../util/api";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import ImageNode, { $createImageNode, $isImageNode } from "../../nodes/image";

export const INSERT_IMAGE: LexicalCommand<{ alt: string, src: string }> = createCommand();

export default function ImagePlugin(){
    const [editor] = useLexicalComposerContext();
    const deleteFile = useAPI(APIs.deleteFile);
    const { id } = useParams();
    const [{ username }] = useCookies(["username"]);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(INSERT_IMAGE, (payload) => {

                editor.update(() => {
                    const selection = $getSelection();
                    const node = $createImageNode(payload.src, payload.src);
                    if ($isRangeSelection(selection)) {
                        if ($isRootNode(selection.anchor.getNode())) {
                            selection.insertParagraph();
                        }
                        selection.insertNodes([node]);
                    }
                    else {
                        $getRoot().selectEnd().insertNodes([node]);
                    }
                });

                return true;
            }, COMMAND_PRIORITY_EDITOR),

            editor.registerMutationListener(ImageNode, (mutations, payload) => {
                payload.prevEditorState.read(() => {
                    Array.from(mutations.entries()).forEach(([key, type]) => {
                        if (type === "destroyed") {
                            const image = $getNodeByKey(key)
                            if ($isImageNode(image)) {
                                deleteFile({
                                    username: username,
                                    url: image.getSrc(),
                                    note_title_id: id as string,
                                })
                            }
                        }
                    })
                })
            })
        )
    }, [deleteFile, editor, id, username]);

    return <ImageModal />;
}