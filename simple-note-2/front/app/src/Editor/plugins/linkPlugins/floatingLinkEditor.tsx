import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { InputRef, theme, Flex, Typography, Input, Button } from "antd";
import { RangeSelection, TextNode, ElementNode, $getSelection, $isRangeSelection } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { useState, useRef, useCallback, useEffect } from "react";
import { WithAnchorProps } from "../../ui/action";
import { $isAtNodeEnd } from "@lexical/selection";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import styles from "./floatingLinkEditor.module.css";
import { autoUpdate, flip, FloatingPortal, inline, offset, shift, useDismiss, useFloating, useInteractions, useTransitionStyles } from "@floating-ui/react";
import { DeleteOutlined } from "@ant-design/icons";
import { PencilSquare } from "../../../util/icons";

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
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const [editor] = useLexicalComposerContext();
    const { token } = theme.useToken();
    const { refs, floatingStyles, context } = useFloating({
        open: show, placement: "bottom", strategy: "absolute",
        whileElementsMounted: autoUpdate,
        middleware: [flip(), offset(8), inline(), shift()],
    });

    const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
        initial: { opacity: 0 }, open: { opacity: 1 }, close: { opacity: 0 }
    });

    const dismiss = useDismiss(context);
    const { getFloatingProps } = useInteractions([dismiss]);

    const clear = useCallback(() => {
        setUrl(undefined);
        setShow(false);
        setEditable(false);
    }, []);

    useEffect(() => {
        function handleMouseUp(e: MouseEvent) {
            if(refs.floating.current?.contains(e.target as Element | null)) return;

            setTimeout(() => {
                editor.read(() => {
                    const selection = $getSelection();
                    if (!$isRangeSelection(selection) || selection.isCollapsed()) return clear();
                    const node = getSelectedNode(selection);
                    const linkNode = $isLinkNode(node) ? node : $findMatchingParent(node, p => $isLinkNode(p));
                    if (!$isLinkNode(linkNode)) return clear();
                    const nativeSelection = window.getSelection();
                    if (!nativeSelection?.rangeCount) return clear();
            
                    setShow(true);
                    setUrl(linkNode.getURL());
                    const range = nativeSelection.getRangeAt(0);
                    refs.setReference({
                        getBoundingClientRect: () => range.getBoundingClientRect(),
                        getClientRects: () => range.getClientRects()
                    });
                });
            }, 1);
        }

        function handleMouseDown(e: MouseEvent){
            if(refs.floating.current?.contains(e.target as Element | null)) return;
            const isCollapsed = editor.read(() => !!$getSelection()?.isCollapsed());
            if(isCollapsed) clear();
        }

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        }
    }, [clear, editor, refs]);

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
            isMounted && <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
                <Flex style={{ ...transitionStyles, backgroundColor: token.colorBgBase }}
                    className={styles.floatingLinkEditor} align="center" gap={"small"}>
                    <Typography.Link target="_blank" rel="noopener noreferrer" href={url}
                        style={{ display: !editable ? undefined : "none" }}>{url}</Typography.Link>
                    <Input type="url" ref={inputRef} style={{ display: editable ? undefined : "none" }} />
                    <Flex gap={"small"}>
                        <Button type={editable ? "primary" : "default"} icon={<PencilSquare />} onClick={handleEdit} />
                        <Button icon={<DeleteOutlined />} onClick={handleDiscard} />
                    </Flex>
                </Flex>
            </div>
        }
    </FloatingPortal>
}