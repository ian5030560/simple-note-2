import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { InputRef, theme, Flex, Typography, Input, Button } from "antd";
import { RangeSelection, TextNode, ElementNode, NodeKey, $getSelection, $isRangeSelection } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { useState, useRef, useCallback, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { FaTrash } from "react-icons/fa6";
import Action from "../../ui/action";
import { $isAtNodeEnd } from "@lexical/selection";
import {$isLinkNode, TOGGLE_LINK_COMMAND} from "@lexical/link";
import styles from "./floatingLinkEditor.module.css";

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

export default function FloatingEditorLinkPlugin(){
    const [url, setUrl] = useState<string>();
    const [show, setShow] = useState(false);
    const [nodeKey, setNodeKey] = useState<NodeKey>();
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const [editor] = useLexicalComposerContext();
    const { token } = theme.useToken();

    const clear = useCallback(() => {
        setUrl(undefined);
        setShow(false);
        setEditable(false);
    }, []);

    const $updateLinkEditor = useCallback(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return clear();
        const node = getSelectedNode(selection);
        const linkNode = $isLinkNode(node) ? node : $findMatchingParent(node, p => $isLinkNode(p));
        if (!$isLinkNode(linkNode)) return clear();
        setUrl(linkNode.getURL());
        setShow(true);
        setNodeKey(linkNode.getKey());
    }, [clear]);


    useEffect(() => editor.registerUpdateListener(({ editorState }) => editorState.read($updateLinkEditor)), [$updateLinkEditor, editor]);

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

    return <>
        {
            nodeKey && <Action open={show} nodeKey={nodeKey} placement={{ bottom: true, left: false }}>
                <Flex style={{ backgroundColor: token.colorBgBase }} gap={"small"} className={styles.floatingLinkEditor} align="center">
                    <Typography.Link target="_blank" rel="noopener noreferrer" href={url}
                        style={{ display: !editable ? undefined : "none" }}>{url}</Typography.Link>
                    <Input type="url" ref={inputRef} style={{ display: editable ? undefined : "none" }} />
                    <Flex gap={"small"}>
                        <Button type={editable ? "primary" : "default"} icon={<CiEdit size={20} />} onClick={handleEdit} />
                        <Button icon={<FaTrash size={20} />} onClick={handleDiscard} />
                    </Flex>
                </Flex>
            </Action>
        }
    </>
}