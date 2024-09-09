import { createPortal } from "react-dom";
import { Plugin } from "../../index";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { $isLinkNode, LinkNode } from "@lexical/link";
import { Button, Flex, Input, InputRef, theme, Typography } from "antd";
import { CiEdit } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from "@lexical/utils"
import styles from "./index.module.css";
import { useAnchor } from "../../../Draggable/component";

const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
function validateUrl(url: string): boolean {
    return url === 'https://' || URL_REGEX.test(url);
}
const LinkPlugin: Plugin = () => <LexicalLinkPlugin validateUrl={validateUrl} />

export default LinkPlugin;

interface LinkProp {
    url: string;
    top: number;
    left: number;
    inputRef: React.Ref<InputRef>;
    editable: boolean;
    onEditClick: (e: React.MouseEvent) => void;
    onDiscardClick: (e: React.MouseEvent) => void;
}
const Link = React.forwardRef((prop: LinkProp, ref: React.Ref<HTMLDivElement>) => {
    const { token } = theme.useToken();

    return <Flex className={styles.floatingLink} ref={ref} align="center" gap={"small"}
        style={{
            transform: `translate(${prop.left}px, ${prop.top}px)`,
            backgroundColor: token.colorBgBase
        }}>
        <Typography.Link href={prop.url} style={{ display: !prop.editable ? undefined : "none" }}>{prop.url}</Typography.Link>
        <Input type="url" ref={prop.inputRef} style={{ display: prop.editable ? undefined : "none" }} />
        <Flex gap={"small"}>
            <Button icon={<CiEdit size={20} />} onClick={(e) => prop.onEditClick(e)} />
            <Button icon={<FaTrash size={20} />} onClick={(e) => prop.onDiscardClick(e)} />
        </Flex>
    </Flex>
})

const DEFAULT = { x: -10000, y: -10000 };
export const FloatingLinkPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();
    const [url, setUrl] = useState("");
    const pos = useRef(DEFAULT);
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const anchor = useAnchor();
    const ref = useRef<HTMLDivElement>(null);

    const showLink = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            let node = selection.anchor.getNode();
            let parent = $findMatchingParent(node, $isLinkNode) as LinkNode | null;

            let url = "";
            let position = DEFAULT;

            if (!parent) {
                setEditable(false);
            }
            else {
                url = parent.getURL();
                let element = editor.getElementByKey(parent.getKey());
                if (!element || !anchor || !ref.current) return;

                let { x, y, height: eHeight } = element.getBoundingClientRect();
                let { top, left, y: wy } = anchor.getBoundingClientRect();
                let { height } = ref.current.getBoundingClientRect();

                let overTop = wy >= y;
                y = !overTop ? y - height : y + eHeight;

                position = { x: x - left, y: y - top };
                inputRef.current!.input!.value = url;
            }
            pos.current = position;
            setUrl(url);
        }
    }, [editor, anchor]);

    useEffect(() => {
        let resizer = new ResizeObserver(() => {
            editor.getEditorState().read(showLink);
        });
        resizer.observe(document.body);
        return () => {
            resizer.unobserve(document.body);
            resizer.disconnect();
        }
    }, [editor, showLink]);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                editor.getEditorState().read(showLink);
                return true;
            }, 1),
            editor.registerUpdateListener(({ editorState }) => editorState.read(showLink)),
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
        setEditable(false);
    }, [editor]);

    const { x, y } = pos.current;
    return anchor ? createPortal(
        <Link top={y} left={x} url={url} editable={editable}
            inputRef={inputRef} ref={ref}
            onEditClick={handleEditClick}
            onDiscardClick={handleDiscardClick}
        />, anchor
    ) : null;
}