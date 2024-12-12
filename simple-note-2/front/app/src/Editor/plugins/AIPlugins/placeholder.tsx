import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
    $getNodeByKey, $getSelection, $isRangeSelection, $isTextNode,
    SELECTION_CHANGE_COMMAND, KEY_TAB_COMMAND, $isParagraphNode, 
    COMMAND_PRIORITY_HIGH, NodeKey,COMMAND_PRIORITY_NORMAL,
    createCommand,
    LexicalCommand} from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";
import "./placeholder.css";
import useAPI from "../../../util/api";
import { notification, Typography } from "antd";

type Send = { message: string };
type Recieve = { result: { message: string } };

function sliceStartText(s1: string, s2: string) {
    const length = Math.max(s1.length, s2.length);

    let index = 0;
    for (let i = 0; i < length; i++) {
        if (s1[i] !== s2[i]) {
            index = i;
            break;
        }
    }
    return s2.slice(index, s2.length);
}

export const SET_PLACEHOLDER: LexicalCommand<boolean> = createCommand();
export const ON_SEND_PLACEHOLDER: LexicalCommand<void> = createCommand();
export const ON_FINISH_PLACEHOLDER: LexicalCommand<void> = createCommand();

const AI_PLACEHOLDER = "data-ai-placeholder";
export default function AIPlaceholderPlugin() {
    const [editor] = useLexicalComposerContext();
    const { ai } = useAPI();
    const socket = useRef<WebSocket>();
    const [api, contextHolder] = notification.useNotification();
    const [key, setKey] = useState<NodeKey>();
    const [open, setOpen] = useState(false);

    useEffect(() => editor.registerCommand(SET_PLACEHOLDER, (value) => {
        setOpen(value);
        return false;
    }, COMMAND_PRIORITY_HIGH), [editor]);

    useEffect(() => {
        if (socket.current || !open) return;

        let retry = 3;
        const interval = setInterval(() => {
            if (retry === 0) {
                clearInterval(interval);
                api.warning({
                    message: "無法連接AI",
                    description: <Typography.Text>無法連接AI，請檢查你的網路設備</Typography.Text>,
                })
            };

            socket.current = ai.socket();
            const { current } = socket;

            function handleClose() {
                console.log("client disconnect");
                current.removeEventListener("open", handleOpen);
                current.removeEventListener("error", handleError);
                socket.current = undefined;
            }

            function handleOpen() {
                console.log("client connect");
                clearInterval(interval);
            }

            function handleError() {
                api.warning({
                    message: "AI連接錯誤",
                    description: <Typography.Text>正在嘗試連接AI...</Typography.Text>,
                });
                retry--;
            }

            current.addEventListener("open", handleOpen);
            current.addEventListener("close", handleClose);
            current.addEventListener("error", handleError);
        }, 1000);

        return () => clearInterval(interval);
    }, [ai, api, open]);

    const getCurrentParagraph = useCallback(() => {
        return editor.read(() => {
            const node = $getNodeByKey(key!);
            if (!node) return;

            let content = node.getTextContent();

            let left = node.getPreviousSibling();
            while ($isTextNode(left)) {
                const leftText = left.getTextContent();
                content = leftText + content;
                left = left.getPreviousSibling();
            }

            let right = node.getNextSibling();
            while ($isTextNode(right)) {
                const rightText = right.getTextContent();
                content += rightText;
            }

            return content;
        });
    }, [editor, key]);

    useEffect(() => {
        if (!socket.current || !open) return;

        const { current } = socket;
        function handleMessage({ data }: MessageEvent<string>) {
            const { result: { message } } = JSON.parse(data) as Recieve;
            editor.dispatchCommand(ON_FINISH_PLACEHOLDER, undefined);
            
            if (!key) return;
            const element = editor.getElementByKey(key);
            if (!element) return;
            const textContent = getCurrentParagraph();

            if (!textContent) return;
            
            element.setAttribute(AI_PLACEHOLDER, sliceStartText(textContent, message));
        }
        current.addEventListener("message", handleMessage);

        return () => {
            current.removeEventListener("message", handleMessage);
            current.close();
        }
    }, [getCurrentParagraph, editor, key, open]);

    useEffect(() => mergeRegister(
        editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            if (!socket.current || !open) return false;

            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const node = !selection.isBackward() ? selection.focus.getNode() : selection.anchor.getNode();
                if ($isTextNode(node)) {
                    let parent = $findMatchingParent(node, p => $isParagraphNode(p) || $isHeadingNode(p));
                    if (parent !== null && node.getTextContent().trim().length > 0) {
                        setKey(node.getKey());
                        return true;
                    }
                }
            }
            setKey(undefined);
            return false;
        }, COMMAND_PRIORITY_HIGH),

        editor.registerCommand(KEY_TAB_COMMAND, (e) => {
            if (!key || !open) return false;
            const element = editor.getElementByKey(key);
            const attrValue = element?.getAttribute(AI_PLACEHOLDER);
            if (!attrValue) return false;

            const node = $getNodeByKey(key);
            if (!$isTextNode(node) || !node.isSelected()) return false;

            const selection = $getSelection();
            if ($isRangeSelection(selection) &&
                selection.focus.getNode().getKey() === key &&
                selection.isCollapsed() &&
                selection.focus.offset === node.getTextContentSize()
            ) {
                e.preventDefault();
                node.setTextContent(node.getTextContent() + attrValue);
                element!.removeAttribute(AI_PLACEHOLDER);
                node.selectEnd();
                return true;
            }
            return false;

        }, COMMAND_PRIORITY_NORMAL),
    ), [editor, key, open]);

    useEffect(() => {
        const root = editor.getRootElement();
        if (!key || !root || !open) return;
        const { current } = socket;
        if (!current) return;
        const element = editor.getElementByKey(key);
        if (!element) return;

        function sendToServer(){
            let textContent = getCurrentParagraph();
            if (!textContent) return;
            if(textContent.length > 300){
                textContent = textContent.slice(textContent.length - (textContent.length % 300));
            }
            const message: Send = { message: textContent };
            current?.send(JSON.stringify(message));
            editor.dispatchCommand(ON_SEND_PLACEHOLDER, undefined);
        }

        function isFilling(lastChar: string){
            const placeholder = element?.getAttribute(AI_PLACEHOLDER);
            if(!placeholder) return false;

            return placeholder.charAt(0) === lastChar;
        }

        function fillPlaceholder(){
            const placeholder = element?.getAttribute(AI_PLACEHOLDER);
            if(!placeholder) return;

            element!.setAttribute(AI_PLACEHOLDER, placeholder.slice(1));
        }

        function clearPlaceholder(){
            element?.removeAttribute(AI_PLACEHOLDER);
        }

        function handleCompositionEnd(e: CompositionEvent){
            if(e.data && isFilling(e.data)){
                fillPlaceholder();
            }
            else{
                clearPlaceholder();
                sendToServer();
            }
            root?.addEventListener("input", handleInput);
        }

        let timer: NodeJS.Timer | undefined = undefined;
        function handleInput(e: Event) {
            const { isComposing, data } = e as InputEvent;

            if (isComposing) {
                root?.removeEventListener("input", handleInput);
                root?.addEventListener("compositionend", handleCompositionEnd, {once: true});
            }
            else{
                if(data && isFilling(data)){
                    fillPlaceholder();
                }
                else{
                    clearPlaceholder();
                    if (timer) {
                        clearTimeout(timer);
                        timer = undefined;
                    }
                    timer = setTimeout(sendToServer, 1000);
                }
            }

        }
        root.addEventListener("input", handleInput);

        return () => {
            root.removeEventListener("input", handleInput);
            element.removeAttribute(AI_PLACEHOLDER);
        };
    }, [getCurrentParagraph, editor, key, open]);

    return contextHolder;
}