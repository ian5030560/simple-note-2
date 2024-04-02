import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "..";
import { useCallback, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { $getNodeByKey, $getSelection, $isRangeSelection, $isTextNode, KEY_TAB_COMMAND, LexicalCommand, SELECTION_CHANGE_COMMAND, TextNode, createCommand} from "lexical";
import "./plugin.css";

const CTRL_SHIFT: LexicalCommand<void> = createCommand();
export const AIPlaceholderPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const [key, setKey] = useState("");
    const [text, setText] = useState("Hello");

    const refresh = useCallback((k: string) => {
        if(!key || k === key) return;
        const element = editor.getElementByKey(key);
        element?.setAttribute("data-text", "");
        
    }, [editor, key]);

    useEffect(() => {
        let root = editor.getRootElement();

        function handleCtrlShift(e: KeyboardEvent){

        }
        root?.addEventListener("keyup", handleCtrlShift);
        return () => root?.removeEventListener("keyup", handleCtrlShift);
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerMutationListener(TextNode, (mutations) => {
                Array.from(mutations).forEach(mutation =>{
                    if(mutation[1] === "created"){
                        let key = mutation[0];
                        editor.getElementByKey(key)?.classList.add("simple-note-2-text-tag");
                    }
                })
            }),
            editor.registerTextContentListener(() => {
                if(!key) return;
                const element = editor.getElementByKey(key);
                element?.setAttribute("data-text", text);
            }),
            
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                const selection = $getSelection();
                let key = "";
                if($isRangeSelection(selection) && selection.isCollapsed()){
                    const node = selection.anchor.getNode();
                    let point = selection.getStartEndPoints()![0];
                    let size = node.getTextContentSize();
                    if($isTextNode(node) && point.offset === size){
                        key = node.getKey();
                    }
                }
                refresh(key);
                setKey(key);
                return false;
            }, 4),
            editor.registerCommand(KEY_TAB_COMMAND, (e) => {
                if(key && text){
                    e.preventDefault();
                    const node = $getNodeByKey(key);
                    if($isTextNode(node)){
                        node.getWritable().__text += text;
                        node.selectEnd();
                    }
                }
                return true;
            }, 4)
        )
    }, [editor, key, refresh, text]);

    return null;
}