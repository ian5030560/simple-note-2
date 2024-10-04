import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import {
    $getNodeByKey, $getSelection, $isRangeSelection, $isTextNode,
    SELECTION_CHANGE_COMMAND, KEY_DOWN_COMMAND, KEY_TAB_COMMAND
} from "lexical";
import "./placeholder.css";

export default function AIPlaceholderPlugin(){
    const [editor] = useLexicalComposerContext();
    const [key, setKey] = useState("");
    const [text, setText] = useState("");
    const [content, setContent] = useState("");
    const socket = useRef(new WebSocket(APIs.getBreezeAI));

    useEffect(() => {
        const { current } = socket;
        current.addEventListener("message", (e: MessageEvent<{ result: string }>) => {
            const { data } = e;
            setText(data.result);
        });
    }, []);

    const refresh = useCallback((k: string) => {
        if (!key || k === key) return;
        const element = editor.getElementByKey(key);
        element?.style.removeProperty("--ai-placeholder-text");

    }, [editor, key]);

    useEffect(() => {
        if (!key) return;
        const element = editor.getElementByKey(key);
        element?.style.setProperty("--ai-placeholder-text", text);
    }, [editor, key, text]);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                const selection = $getSelection();
                let key = "";
                if ($isRangeSelection(selection) && selection.isCollapsed()) {
                    const node = selection.anchor.getNode();
                    const point = selection.getStartEndPoints()![0];
                    const size = node.getTextContentSize();

                    if ($isTextNode(node) && point.offset === size) {
                        key = node.getKey();
                    }
                }
                refresh(key);
                setKey(key);
                return false;
            }, 4),
            editor.registerCommand(KEY_TAB_COMMAND, (e) => {
                if (key && text) {
                    e.preventDefault();
                    const node = $getNodeByKey(key);
                    if ($isTextNode(node)) {
                        node.getWritable().__text += text;
                        setText("");
                        node.selectEnd();
                        return true;
                    }
                }
                return false;
            }, 4),

            editor.registerCommand(KEY_DOWN_COMMAND, (e) => {
                if (key && text) {
                    if (text[0] === e.key) {
                        setText(text.substring(1));
                    }
                }
                return false;
            }, 4),

            editor.registerTextContentListener(setContent)
        )
    }, [editor, key, refresh, text]);

    return null;
}