import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "..";
import { useCallback, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import {
    $getNodeByKey, $getSelection, $isRangeSelection, $isTextNode, KEY_DOWN_COMMAND, KEY_TAB_COMMAND,
    SELECTION_CHANGE_COMMAND, TextNode
} from "lexical";
import "./placeholder.css";
import useAPI, { APIs } from "../../../util/api";

const TEXT_TAG = "simple-note-2-text-tag"
export const AIPlaceholderPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const [key, setKey] = useState("");
    const [text, setText] = useState("");
    const callAI = useAPI(APIs.callAI);
    const [content, setContent] = useState("");

    const refresh = useCallback((k: string) => {
        if (!key || k === key) return;
        const element = editor.getElementByKey(key);
        element?.setAttribute("data-text", "");

    }, [editor, key]);

    useEffect(() => {
        if (!key) return;
        const element = editor.getElementByKey(key);
        element?.setAttribute("data-text", text);
    }, [editor, key, text]);

    useEffect(() => {
        let id = setTimeout(async () => {
            let rtext = await callAI({ text: `please predict next text from this content below: \n${content}` })[0]
                .then(res => res.json())
                .then(data => data["answer"]);
    
            if (rtext !== text) {
                setText(rtext);
            }
        }, 1000);
        return () => {
            clearTimeout(id);
        }
    }, [callAI, content, editor, key, text]);

    useEffect(() => {
        return mergeRegister(
            editor.registerMutationListener(TextNode, (mutations) => {
                Array.from(mutations).forEach(mutation => {
                    if (mutation[1] === "created") {
                        let key = mutation[0];
                        editor.getElementByKey(key)?.classList.add(TEXT_TAG);
                    }
                })
            }),

            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                const selection = $getSelection();
                let key = "";
                if ($isRangeSelection(selection) && selection.isCollapsed()) {
                    const node = selection.anchor.getNode();
                    let point = selection.getStartEndPoints()![0];
                    let size = node.getTextContentSize();

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