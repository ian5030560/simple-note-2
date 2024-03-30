import { Plugin } from "../../index";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import React, { useCallback, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isRangeSelection, BaseSelection, LexicalNode } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { $isLinkNode, LinkNode } from "@lexical/link";
import { Button, Input, InputRef } from "antd";
import { CiEdit } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import styles from "./index.module.css";
import Corner, { CornerRef } from "../../UI/corner";

const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
function validateUrl(url: string): boolean {
    return url === 'https://' || URL_REGEX.test(url);
}

const LinkPlugin: Plugin = () => <LexicalLinkPlugin validateUrl={validateUrl} />

export default LinkPlugin;

export const FloatingLinkPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();
    const [url, setUrl] = useState<string>("");
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const ref = useRef<CornerRef>(null);


    const handleSelection = useCallback((selection: BaseSelection | null) => {
        let url = "";
        if ($isRangeSelection(selection)) {
            let node: LexicalNode | null = selection.anchor.getNode();
            if (!$isLinkNode(node)) {
                node = $findMatchingParent(node, $isLinkNode);
            }

            if ($isLinkNode(node)) {
                url = node.getURL();
                ref.current?.place(node.getKey());
            }
        }

        setEditable(false);
        setUrl(url);
        if (inputRef.current) inputRef.current.input!.value = url;
        if (!url) {
            ref.current?.leave();
        }
        
    }, []);

    const handleEditClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (editable) editor.dispatchCommand(TOGGLE_LINK_COMMAND, inputRef.current!.input!.value);
        setEditable(prev => !prev);
    }, [editable, editor]);

    const handleDiscardClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        setEditable(() => false);
    }, [editor]);


    return <Corner nodeType={LinkNode} placement={["top"]} trigger="selected"
        onSeletionChange={handleSelection} outside ref={ref} className={styles.floatingLink}>
        <a href={url} style={{ display: !editable ? undefined : "none" }}>{url}</a>
        <Input type="url" ref={inputRef} placeholder="http://..." style={{ display: editable ? undefined : "none" }} />
        <Button icon={<CiEdit size={20} />} onClick={handleEditClick} />
        <Button icon={<FaTrash size={20} />} onClick={handleDiscardClick} />
    </Corner>
}