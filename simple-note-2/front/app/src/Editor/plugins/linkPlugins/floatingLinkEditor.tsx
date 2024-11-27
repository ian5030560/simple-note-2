import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { InputRef, theme, Flex, Typography, Input, Button } from "antd";
import { RangeSelection, TextNode, ElementNode, $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_EDITOR, NodeKey, $getNodeByKey } from "lexical";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { useState, useRef, useCallback, useEffect } from "react";
import { WithAnchorProps } from "../../ui/action";
import { $isAtNodeEnd } from "@lexical/selection";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import styles from "./floatingLinkEditor.module.css";
import { PencilSquare, Trash3Fill } from "react-bootstrap-icons";
import { autoUpdate, flip, FloatingPortal, offset, useFloating, useTransitionStyles } from "@floating-ui/react";

function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
        return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
        return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
        return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
    }
}

type FloatingEditorLinkPluginProps = WithAnchorProps;
export default function FloatingEditorLinkPlugin(props: FloatingEditorLinkPluginProps) {
    const [url, setUrl] = useState<string>();
    const [show, setShow] = useState(false);
    const [nodeKey, setNodeKey] = useState<NodeKey>();
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const [editor] = useLexicalComposerContext();
    const { token } = theme.useToken();
    const { refs, floatingStyles, context } = useFloating({
        open: show, placement: "bottom", strategy: "absolute",
        whileElementsMounted: autoUpdate,
        middleware: [flip(), offset(8)],
    });

    const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
        initial: { opacity: 0 }, open: { opacity: 1 }, close: { opacity: 0 }
    });

    const clear = useCallback(() => {
        setUrl(undefined);
        setShow(false);
        setEditable(false);
    }, []);

    const updatePosition = useCallback(() => {
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        const range = selection.getRangeAt(0);
        refs.setReference({
            getBoundingClientRect: () => range.getBoundingClientRect(),
            getClientRects: () => range.getClientRects()
        });
    }, [refs]);

    const $updateEditor = useCallback(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) return clear();
        const node = getSelectedNode(selection);
        const linkNode = $isLinkNode(node) ? node : $findMatchingParent(node, p => $isLinkNode(p));
        if (!$isLinkNode(linkNode)) return clear();
        setNodeKey(linkNode.getKey());
    }, [clear]);

    useEffect(() => {
        if(!nodeKey) return;
        const element = editor.getElementByKey(nodeKey);
        if(!element) return;
        
        function handleMouseUp(){
            updatePosition();
            setShow(true);
            setUrl(editor.read(() => {
                const node = $getNodeByKey(nodeKey!);
                return $isLinkNode(node) ? node.getURL() : undefined;
            }));
        }
        element.addEventListener("mouseup", handleMouseUp);

        return () => element.removeEventListener("mouseup", handleMouseUp);
    }, [editor, nodeKey, updatePosition]);

    useEffect(() => mergeRegister(
        editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            $updateEditor();
            return false;
        }, COMMAND_PRIORITY_EDITOR),
        editor.registerUpdateListener(() => editor.read($updateEditor))
    ), [$updateEditor, editor]);

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (editable) editor.dispatchCommand(TOGGLE_LINK_COMMAND, inputRef.current!.input!.value);
        setEditable(prev => !prev);
    }, [editable, editor]);

    const handleDiscard = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        clear();
    }, [clear, editor]);

    return <FloatingPortal root={props.anchor}>
        {
            isMounted && <div ref={refs.setFloating} style={floatingStyles}>
                <Flex style={{ ...transitionStyles, backgroundColor: token.colorBgBase }}
                    className={styles.floatingLinkEditor} align="center" gap={"small"}>
                    <Typography.Link target="_blank" rel="noopener noreferrer" href={url}
                        style={{ display: !editable ? undefined : "none" }}>{url}</Typography.Link>
                    <Input type="url" ref={inputRef} style={{ display: editable ? undefined : "none" }} />
                    <Flex gap={"small"}>
                        <Button type={editable ? "primary" : "default"} icon={<PencilSquare size={16} />} onClick={handleEdit} />
                        <Button icon={<Trash3Fill size={16} />} onClick={handleDiscard} />
                    </Flex>
                </Flex>
            </div>
        }
    </FloatingPortal>
}