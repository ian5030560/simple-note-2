import { useCallback, useEffect, useState } from "react";
import { $getNodeByKey, $getSelection, $isRangeSelection, $isTextNode, LexicalCommand, SELECTION_CHANGE_COMMAND, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapSelectionInMarkNode, MarkNode, $createMarkNode, $isMarkNode } from "@lexical/mark";
import { mergeRegister, registerNestedElementResolver } from "@lexical/utils";
import useStore from "./store";
import { useCookies } from "react-cookie";
import { uuid } from "../../../util/uuid";
import { CommentCardMap, CommentSider } from "./component";

export const INSERT_COMMENT: LexicalCommand<void> = createCommand();
export default function CommentPlugin(){
    const [editor] = useLexicalComposerContext();
    const store = useStore([]);
    const [title, setTitle] = useState("");
    const [{ username }] = useCookies(["username"]);
    const [cards, setCards] = useState<CommentCardMap>({});

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(INSERT_COMMENT, () => {
                const selection = $getSelection();
                if ($isRangeSelection(selection) && !selection.isCollapsed()) {
                    $wrapSelectionInMarkNode(selection, selection.isBackward(), uuid());
                }
                return false;
            }, 1),
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        const node = selection.anchor.getNode();
                        if ($isTextNode(node)) {
                            // let ids = $getMarkIDs(node, selection.anchor.offset);
                            setTitle(selection.getTextContent());
                        }
                    }
                })
                return false;
            }, 1),

            registerNestedElementResolver<MarkNode>(editor, MarkNode,
                (from: MarkNode) => $createMarkNode(from.getIDs()),
                (from: MarkNode, to: MarkNode) => {
                    const ids = from.getIDs();
                    ids.forEach((id) => to.addID(id));
                }
            ),

            editor.registerMutationListener(MarkNode, (mutations) => {
                editor.getEditorState().read(() => {
                    Array.from(mutations).forEach(([key, tag]) => {
                        if(tag === "created"){
                            const node = $getNodeByKey(key);
                            if($isMarkNode(node)){
                                const ids = node.getIDs();
                                for(const id of ids){
                                    // setCards(prev => {

                                    // })
                                }
                            }
                        }
                    })
                })
            })
        )
    }, [editor, store, title]);

    const handleAdd = useCallback((id: string, text: string) => {
        const item = store.getItem(id);
        if (!item) return;
        item.comments.push({
            id: uuid(),
            author: username,
            content: text,
            timestamp: Date.now(),
        })
    }, [store, username]);

    return <CommentSider cards={cards}
        onDeleteCard={() => { }} 
        onDeleteCardItem={() => { }}
        onSubmmit={() => {}}
    />;
}