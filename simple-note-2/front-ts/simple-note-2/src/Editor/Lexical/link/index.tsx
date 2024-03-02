import { createPortal } from "react-dom";
import { Plugin } from "../Interface";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { $isLinkNode, LinkNode } from "@lexical/link";
import { theme, Button } from "antd";
import { CiEdit } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from "@lexical/utils"
import styles from "./index.module.css";

const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
function validateUrl(url: string): boolean {
    return url === 'https://' || URL_REGEX.test(url);
}

const LinkPlugin: Plugin = () => <LexicalLinkPlugin validateUrl={validateUrl} />

export default LinkPlugin;

const PADDING = 8;
interface FloatingProp extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    $backgroundColor: string;
    style: React.CSSProperties;
}
const Floating = ({$backgroundColor, style, ...prop}: FloatingProp) => <div className={styles.floatingLink} {...prop} style={{backgroundColor: $backgroundColor, ...style}}/>;

interface FloatingLinkProp {
    url?: string,
    top: number,
    left: number,
    inputRef: React.Ref<HTMLInputElement>,
    editable: boolean;
    onEditClick: (e: React.MouseEvent) => void;
    onDiscardClick: (e: React.MouseEvent) => void;
}
const Link: React.FC<FloatingLinkProp> = (prop) => {
    const { token } = theme.useToken();

    return <Floating
        style={{
            transform: `translate(${prop.left}px, ${prop.top}px)`
        }}
        $backgroundColor={token.colorBgBase}
    >

        <a href={prop.url} style={{ display: !prop.editable ? undefined : "none" }}>{prop.url}</a>
        <input type="url" ref={prop.inputRef} placeholder="https://..." style={{ display: prop.editable ? undefined : "none" }} />

        <span style={{ width: 5 }} />
        <Button icon={<CiEdit size={20} />} onClick={(e) => prop.onEditClick(e)} />
        <Button icon={<FaTrash size={20} />} onClick={(e) => prop.onDiscardClick(e)} />
    </Floating>
}

const DEFAULT = { x: -10000, y: -10000 };
export const FloatingLinkPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();
    const [url, setUrl] = useState<string | undefined>(undefined);
    const [pos, setPos] = useState(DEFAULT);
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const showLink = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                let node = selection.anchor.getNode();
                let parent = $findMatchingParent(node, (n) => $isLinkNode(n)) as LinkNode | null;
            
                let url: string | undefined = undefined;
                let position: { x: number, y: number } = DEFAULT;
                if (parent) {
                    url = parent.getURL();
                    let element = editor.getElementByKey(parent.getKey())!;
                    let { x, y, height } = element.getBoundingClientRect();
                    position = { x: x, y: y - height - PADDING * 3 };
                    inputRef.current!.value = url;
                }
                setEditable(false);
                setUrl(url);
                setPos(position);
            }
        });

        return false;
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => showLink(), 1),
            editor.registerUpdateListener(() => showLink()),
        )
    }, [editor, showLink]);

    const handleEditClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (editable) editor.dispatchCommand(TOGGLE_LINK_COMMAND, inputRef.current!.value);
        setEditable(prev => !prev);
    }, [editable, editor]);

    const handleDiscardClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        setEditable(() => false);
    }, [editor]);

    return createPortal(
        <Link top={pos.y} left={pos.x} url={url}
            editable={editable}
            onEditClick={handleEditClick}
            onDiscardClick={handleDiscardClick}
            inputRef={inputRef}
        />, document.body
    );
}