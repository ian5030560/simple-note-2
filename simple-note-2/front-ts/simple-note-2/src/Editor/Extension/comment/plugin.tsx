import { useCallback, useEffect, useState } from "react";
import { Plugin } from "..";
import { $getNodeByKey, $getSelection, $isRangeSelection, $isTextNode, LexicalCommand, SELECTION_CHANGE_COMMAND, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapSelectionInMarkNode, MarkNode, $createMarkNode, $isMarkNode } from "@lexical/mark";
import CommentPool from "./component";
import { mergeRegister, registerNestedElementResolver } from "@lexical/utils";
import useStore from "./store";
import { useCookies } from "react-cookie";
import uuid from "../../../util/uuid";

export const INSERT_COMMENT: LexicalCommand<void> = createCommand();
const CommentPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const store = useStore([]);
    const [title, setTitle] = useState("");
    const [{username}] = useCookies(["username"]);

    useEffect(() => { 
        return mergeRegister(
            editor.registerCommand(INSERT_COMMENT, () => {
                let selection = $getSelection();
                if ($isRangeSelection(selection) && !selection.isCollapsed()) {
                    $wrapSelectionInMarkNode(selection, selection.isBackward(), uuid(10));
                }
                return false;
            }, 1),
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                editor.update(() => {
                    let selection = $getSelection();
                    if($isRangeSelection(selection)){
                        let node = selection.anchor.getNode();
                        if($isTextNode(node)){
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
                Array.from(mutations).forEach(([key, tag]) => {
                    if(tag === "created"){
                        editor.update(() => {
                            const node = $getNodeByKey(key);
                            if($isMarkNode(node)){
                                let ids = node.getIDs();
                                for(let id of ids){
                                    if(!store.getItem(id)){
                                        console.log(title);
                                        store.createItem(id, title);
                                    }
                                }
                            }
                        })
                    }
                    if(tag === "destroyed"){
                        
                    }
                })
            })
        )
    }, [editor, store, title]);

    const handleAdd = useCallback((id: string, text: string) => {
        let item = store.getItem(id);
        if(!item) return;
        item.comments.push({
            id: uuid(5),
            author: username,
            content: text,
            timestamp: Date.now(),
        })
    }, [store, username]);

    
    return <CommentPool items={Array.from(store.collection).map(([key, item]) => {
        return { 
            title: item.title,
            id: key,
            items: item.comments.map(i => ({
                author: i.author,
                timestamp: i.timestamp,
                text: i.content, 
            })),
        } 
    })} onAdd={handleAdd}/>;
}

export default CommentPlugin;