import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { InputRef, theme, Flex, Typography, Input, Button } from "antd";
import { RangeSelection, TextNode, ElementNode, NodeKey, $getSelection, $isRangeSelection } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { useState, useRef, useCallback, useEffect } from "react";
import Action, { WithAnchorProps } from "../../ui/action";
import { $isAtNodeEnd } from "@lexical/selection";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import styles from "./floatingLinkEditor.module.css";
import { PencilSquare, Trash3Fill } from "react-bootstrap-icons";

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

    return <Action open={show} offset={8} nodeKey={nodeKey} placement={"bottom"} anchor={props.anchor}>
        <Flex style={{ backgroundColor: token.colorBgBase }} gap={"small"} className={styles.floatingLinkEditor} align="center">
            <Typography.Link target="_blank" rel="noopener noreferrer" href={url}
                style={{ display: !editable ? undefined : "none" }}>{url}</Typography.Link>
            <Input type="url" ref={inputRef} style={{ display: editable ? undefined : "none" }} />
            <Flex gap={"small"}>
                <Button type={editable ? "primary" : "default"} icon={<PencilSquare size={16} />} onClick={handleEdit} />
                <Button icon={<Trash3Fill size={16} />} onClick={handleDiscard} />
            </Flex>
        </Flex>
    </Action>
}