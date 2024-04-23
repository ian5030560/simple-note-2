import { createPortal } from "react-dom";
import { Plugin } from "../../index";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { $isLinkNode, LinkNode } from "@lexical/link";
import { Button, Input, InputRef } from "antd";
import { CiEdit } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from "@lexical/utils"
import styles from "./index.module.css";
import { useWrapper } from "../../../Draggable/component";

const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
function validateUrl(url: string): boolean {
    return url === 'https://' || URL_REGEX.test(url);
}
const LinkPlugin: Plugin = () => <LexicalLinkPlugin validateUrl={validateUrl} />

export default LinkPlugin;

interface LinkProp {
    url?: string,
    top: number,
    left: number,
    inputRef: React.Ref<InputRef>,
    editable: boolean;
    onEditClick: (e: React.MouseEvent) => void;
    onDiscardClick: (e: React.MouseEvent) => void;
}
const Link = React.forwardRef((prop: LinkProp, ref: React.Ref<HTMLDivElement>) => {

    return <div
        className={styles.floatingLink}
        style={{ transform: `translate(${prop.left}px, ${prop.top}px)` }}
        ref={ref}
    >
        <a href={prop.url} style={{ display: !prop.editable ? undefined : "none" }}>{prop.url}</a>
        <Input type="url" ref={prop.inputRef} placeholder="http://..." style={{ display: prop.editable ? undefined : "none" }} />
        <Button icon={<CiEdit size={20} />} onClick={(e) => prop.onEditClick(e)} />
        <Button icon={<FaTrash size={20} />} onClick={(e) => prop.onDiscardClick(e)} />
    </div>
})

const DEFAULT = { x: -10000, y: -10000 };
export const FloatingLinkPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();
    const [url, setUrl] = useState<string>("");
    const [pos, setPos] = useState(DEFAULT);
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const wrapper = useWrapper();
    const fRef = useRef<HTMLDivElement>(null);

    const showLink = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                let node = selection.anchor.getNode();
                let parent = $findMatchingParent(node, $isLinkNode) as LinkNode | null;

                let url = "";
                let position = DEFAULT;
                if (parent) {
                    url = parent.getURL();
                    let element = editor.getElementByKey(parent.getKey());

                    if (!element || !wrapper || !fRef.current) return;

                    let { x, y } = element.getBoundingClientRect();
                    let { top, left } = wrapper.getBoundingClientRect();
                    let { height } = fRef.current.getBoundingClientRect();

                    position = { x: x - left, y: y - top - height };
                    inputRef.current!.input!.value = url;
                }
                setEditable(false);
                setUrl(url);
                setPos(position);
            }
        });

        return false;
    }, [editor, wrapper]);

    useEffect(() => {
        let resizer = new ResizeObserver(() => {
            showLink();
        });
        resizer.observe(document.body);
        return () => {
            resizer.unobserve(document.body);
            resizer.disconnect();
        }
    }, [showLink]);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => showLink(), 1),
            editor.registerUpdateListener(() => showLink()),
        )
    }, [editor, showLink]);

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

    return wrapper ? createPortal(
        <Link top={pos.y} left={pos.x} url={url}
            editable={editable}
            onEditClick={handleEditClick}
            onDiscardClick={handleDiscardClick}
            inputRef={inputRef}
            ref={fRef}
        />, wrapper
    ) : null;
}