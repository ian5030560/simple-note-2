import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
    $getNodeByKey, $getSelection, $isRangeSelection, $isTextNode,
    SELECTION_CHANGE_COMMAND, KEY_DOWN_COMMAND, KEY_TAB_COMMAND,
    $isParagraphNode,
    COMMAND_PRIORITY_HIGH,
    ParagraphNode,
    LexicalNode,
    NodeKey,
    TextNode,
    COMMAND_PRIORITY_NORMAL
} from "lexical";
import { $isHeadingNode, HeadingNode } from "@lexical/rich-text";
import "./placeholder.css";
import useAPI from "../../../util/api";
import { notification, Typography } from "antd";

type Send = { message: string };
type Recieve = { result: { message: string } };

function sliceTextByCommon(s1: string, s2: string) {
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

const AI_PLACEHOLDER = "data-ai-placeholder";
export default function AIPlaceholderPlugin() {
    const [editor] = useLexicalComposerContext();
    const { ai } = useAPI();
    const socket = useRef<WebSocket>();
    const [api, contextHolder] = notification.useNotification();
    const [key, setKey] = useState<NodeKey>();

    useEffect(() => {
        if (socket.current) return;

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
    }, [ai, api]);

    const collectTextWithSilbings = useCallback(() => {
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
        if (!socket.current) return;

        const { current } = socket;
        function handleMessage({ data }: MessageEvent<string>) {
            const { result: { message } } = JSON.parse(data) as Recieve;

            if (!key) return;
            const element = editor.getElementByKey(key);
            if (!element) return;
            const textContent = collectTextWithSilbings();

            if (!textContent) return;
            element.setAttribute(AI_PLACEHOLDER, sliceTextByCommon(textContent!, message));
        }
        current.addEventListener("message", handleMessage);

        return () => current.removeEventListener("message", handleMessage);
    }, [collectTextWithSilbings, editor, key]);

    useEffect(() => mergeRegister(
        editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            if (!socket.current) return false;

            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const node = selection.focus.getNode();
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
            if (!key || !e.shiftKey) return false;
            const element = editor.getElementByKey(key);
            const attrValue = element?.getAttribute(AI_PLACEHOLDER);
            if (!attrValue) return false;

            const node = $getNodeByKey(key);
            if (!node || !node.isSelected()) return false;

            const selection = $getSelection();
            if ($isRangeSelection(selection) &&
                selection.focus.getNode().getKey() === key &&
                selection.isCollapsed() &&
                selection.focus.offset === node.getTextContentSize()
            ) {
                e.preventDefault();
                selection.insertRawText(attrValue);
                element!.removeAttribute(AI_PLACEHOLDER);
                
                setTimeout(() => editor.update(() => node.selectEnd()), 0);
                return true;
            }

            return false;
        }, COMMAND_PRIORITY_NORMAL)
    ), [editor, key]);

    useEffect(() => {
        const root = editor.getRootElement();
        if (!key || !root) return;
        const { current } = socket;
        if (!current) return;
        const element = editor.getElementByKey(key);
        if (!element) return;

        let timer: NodeJS.Timer | undefined = undefined;
        function handleInput(e: Event) {
            const { isComposing } = e as InputEvent;
            if (isComposing) return;
            const textContent = collectTextWithSilbings();
            if (!textContent) return;

            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }

            timer = setTimeout(() => {
                const message: Send = { message: textContent };
                current?.send(JSON.stringify(message));
                console.log("send to server");
            }, 1000);
        }

        root.addEventListener("input", handleInput);

        return () => {
            root.removeEventListener("input", handleInput);
            element.removeAttribute(AI_PLACEHOLDER);
        };
    }, [collectTextWithSilbings, editor, key]);

    return contextHolder;
}