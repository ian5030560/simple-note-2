import { Button, List, theme } from "antd";
import styles from "./component.module.css";
import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import { $getNodeByKey, NodeKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { inside } from "../../utils";
import { PLUSMENU_SELECTED } from "./command";
import { WithAnchorProps } from "../../ui/action";
import { WithOverlayProps } from "../../types";
import { autoUpdate, flip, FloatingPortal, offset, useFloating } from "@floating-ui/react";

export interface PlusItem {
    value: string;
    label: string;
    icon: React.ReactNode;
}

interface DragHandlerProps extends WithAnchorProps, WithOverlayProps {
    pos: { x: number, y: number };
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    items: PlusItem[];
    nodeKey: NodeKey;
}
export const DragHandler = (props: DragHandlerProps) => {
    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();
    const { token } = theme.useToken();
    const { refs, floatingStyles } = useFloating({
        strategy: "absolute",
        placement: "bottom-start",
        whileElementsMounted: autoUpdate,
        middleware: [flip(), offset(8)],
    });

    useEffect(() => refs.setReference(editor.getElementByKey(props.nodeKey)), [editor, props.nodeKey, refs]);

    const block = useCallback(() => props.overlayContainer?.style.removeProperty("pointer-events"), [props.overlayContainer?.style]);
    const unblock = useCallback(() => props.overlayContainer?.style.setProperty("pointer-events", "none"), [props.overlayContainer?.style]);
    
    useEffect(() => {
        if(!open) return;
        const {body} = document;
        function handleClickOutside(e: MouseEvent){
            const {current: floating} = refs.floating;
            if(!floating || inside(e.clientX, e.clientY, floating)) return;
            setOpen(false);
            unblock();
        }
        body.addEventListener("click", handleClickOutside);

        return () => body.removeEventListener("click", handleClickOutside);
    }, [open, refs.floating, unblock]);

    return <div className={styles.draggable} draggable={true}
        onDragStart={props.onDragStart} onDragEnd={props.onDragEnd} tabIndex={-1}
        style={{ transform: `translate(calc(${props.pos.x - 8}px - 100%), calc(${props.pos.y}px - 50%))` }}>

        <Button size="large" contentEditable={false} type="text" icon={<PlusOutlined />} onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
            block();
        }} />
        <FloatingPortal root={props.overlayContainer}>
            {
                <div className={styles.dropDown} ref={refs.setFloating} style={{
                    ...floatingStyles,
                    display: !open ? "none" : undefined,
                    backgroundColor: token.colorBgBase
                }}>
                    <List dataSource={props.items} renderItem={(item) => <List.Item key={item.value} style={{ width: "100%", padding: 0 }}>
                        <Button icon={item.icon} block type="text" style={{ justifyContent: "flex-start" }}
                            onClick={() => {
                                setOpen(false);
                                unblock();
                                const node = editor.getEditorState().read(() => $getNodeByKey(props.nodeKey));
                                if (!node) return;

                                editor.dispatchCommand(PLUSMENU_SELECTED, { node: node, value: item.value })
                            }}>
                            {item.label}
                        </Button>
                    </List.Item>} />
                </div>
            }
        </FloatingPortal>

        <Button size="large" className={styles.handleButton} contentEditable={false} type="text" icon={<HolderOutlined />} />
    </div>
};

interface DragLineProps {
    pos: { x: number, y: number };
    size: { width: number, height: number };
}
export const DragLine = ({ pos, size }: DragLineProps) => {

    return <div className={styles.dropLine} style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: size.width, height: size.height
    }} />
}