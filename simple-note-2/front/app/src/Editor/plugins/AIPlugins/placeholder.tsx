import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
    $getNodeByKey, $getSelection, $isRangeSelection, $isTextNode,
    SELECTION_CHANGE_COMMAND, KEY_DOWN_COMMAND, KEY_TAB_COMMAND,
    $isParagraphNode
} from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";
import "./placeholder.css";

export default function AIPlaceholderPlugin() {
    const [editor] = useLexicalComposerContext();
    const [key, setKey] = useState("");
    const [text, setText] = useState("");
    const [content, setContent] = useState("");
    const socket = useRef<WebSocket>();
    const [needUpdate, setNeedUpdate] = useState(false);

    useEffect(() => {
        if(socket.current) return;
        socket.current = new WebSocket(APIs.getBreezeAI);
        const { current } = socket;

        function handleMessage(e: MessageEvent<string>) {
            const { data } = e;
            setText(JSON.parse(data).result);
        }

        function handleClose(){
            console.log("client disconnect");
            socket.current = undefined;
        }

        function handleOpen(){
            console.log("client connect");
        }
        current.addEventListener("open", handleOpen);
        current.addEventListener("message", handleMessage);
        current.addEventListener("close", handleClose);
        return () => {
            current.removeEventListener("close", handleOpen);
            current.removeEventListener("message", handleMessage);
            current.removeEventListener("close", handleClose);
            current.close();
            socket.current = undefined;
        }
    }, []);

    useEffect(() => {
        const { current } = socket;
        if (!content || !current || !needUpdate) return;

        const id = setTimeout(() => {
            current.send(content.length > 300 ? content.slice(300) : content);
        }, 500);

        return () => clearTimeout(id);
    }, [content, needUpdate]);

    const refresh = useCallback((k: string) => {
        if (!key || k === key) return;
        const element = editor.getElementByKey(key);
        element?.removeAttribute("data-ai-placeholder");

    }, [editor, key]);

    useEffect(() => {
        if (!key) return;
        const element = editor.getElementByKey(key);
        element?.setAttribute("data-ai-placeholder", text);
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
                if (e.shiftKey && key && text) {
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
            editor.registerTextContentListener(() => {
                editor.getEditorState().read(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection) && selection.isCollapsed()) {
                        const node = selection.anchor.getNode();
                        const parent = $isParagraphNode(node) || $isHeadingNode(node) ? node : $findMatchingParent(node, p => $isParagraphNode(p) || $isHeadingNode(p));

                        if (parent) {
                            setContent(parent.getTextContent());
                            setNeedUpdate(true);
                        }
                    }
                });
            })
        )
    }, [editor, key, refresh, text]);

    return null;
}