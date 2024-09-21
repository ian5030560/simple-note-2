import { Plugin } from "../../index";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, NodeKey } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { $isLinkNode } from "@lexical/link";
import { Button, Flex, Input, InputRef, theme, Typography } from "antd";
import { CiEdit } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import Action from "../../UI/action";

const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
function validateUrl(url: string): boolean {
    return url === 'https://' || URL_REGEX.test(url);
}
const LinkPlugin: Plugin = () => <LexicalLinkPlugin validateUrl={validateUrl} />;

export default LinkPlugin;

export const FloatingLinkPlugin = () => {
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
        const node = selection.anchor.getNode();
        const linkNode = $isLinkNode(node) ? node : $findMatchingParent(node, p => $isLinkNode(p));
        if (!$isLinkNode(linkNode)) return clear();
        setUrl(linkNode.getURL());
        setShow(true);
        setNodeKey(linkNode.getKey());
    }, [clear]);

    useEffect(() => editor.registerUpdateListener(({editorState}) => editorState.read($updateLinkEditor)), [$updateLinkEditor, editor]);

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
            nodeKey && <Action open={show} nodeKey={nodeKey} placement={{ top: true, left: false }}>
                <Flex style={{ backgroundColor: token.colorBgBase }} gap={"small"}>
                    <Typography.Link target="_blank" rel="noopener noreferrer" href={url}
                        style={{ display: !editable ? undefined : "none" }}>{url}</Typography.Link>
                    <Input type="url" ref={inputRef} style={{ display: editable ? undefined : "none" }} />
                    <Flex gap={"small"}>
                        <Button icon={<CiEdit size={20} />} onClick={handleEdit} />
                        <Button icon={<FaTrash size={20} />} onClick={handleDiscard} />
                    </Flex>
                </Flex>
            </Action>
        }
    </>
}