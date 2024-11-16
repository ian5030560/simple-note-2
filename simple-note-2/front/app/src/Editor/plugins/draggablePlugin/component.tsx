import { Button, List, theme } from "antd";
import styles from "./component.module.css";
import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import { createPortal } from "react-dom";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { $getNodeByKey, NodeKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { inside, useOverlayLockState } from "../../utils";
import { PLUSMENU_SELECTED } from "./command";
import { WithAnchorProps } from "../../ui/action";
import { WithOverlayProps } from "../../types";

export interface PlusItem {
    value: string;
    label: string;
    icon: React.ReactNode;
}

interface PlusMenuProps extends WithAnchorProps, WithOverlayProps {
    items: PlusItem[];
    nodeKey: NodeKey;
    onSelect: () => void;
    open: boolean;
}

const PlusMenu = forwardRef(({ items, nodeKey, onSelect, open, anchor, overlayContainer }: PlusMenuProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const { token } = theme.useToken();
    const [pos, setPos] = useState<{ x: number, y: number }>();
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const element = editor.getElementByKey(nodeKey);
        if (!element || !anchor) return;

        function update() {
            const { x, y: _y, height } = element!.getBoundingClientRect();
            const { height: bh } = document.body.getBoundingClientRect();
            const over = _y + height + 8 + 250 > bh;
            setPos({ x, y: !over ? _y + height + 8 : _y - 250 - 8 });
        }

        const resizer = new ResizeObserver(update);
        resizer.observe(element);

        return () => {
            resizer.unobserve(element);
            resizer.disconnect();
        }
    }, [anchor, editor, nodeKey]);

    if (!pos || !open) return null;

    return createPortal(<div className={styles.dropDown} ref={ref} style={{
        backgroundColor: token.colorBgBase,
        transform: `translate(${pos.x}px, ${pos.y}px)`
    }}>
        <List renderItem={(item) => <List.Item key={item.value} style={{ width: "100%", padding: 0 }}>
            <Button icon={item.icon} block type="text" style={{ justifyContent: "flex-start" }}
                onClick={() => {
                    onSelect();
                    const node = editor.getEditorState().read(() => $getNodeByKey(nodeKey));
                    if (!node) return;

                    editor.dispatchCommand(PLUSMENU_SELECTED, { node: node, value: item.value })
                }}>
                {item.label}
            </Button>
        </List.Item>} dataSource={items} />
    </div>, overlayContainer || document.body);
})

interface DragHandlerProps extends WithAnchorProps, WithOverlayProps {
    pos: { x: number, y: number };
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    items: PlusItem[];
    nodeKey: NodeKey;
}
export const DragHandler = ({ pos, onDragStart, onDragEnd, items, overlayContainer, nodeKey, anchor }: DragHandlerProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const handlerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useOverlayLockState(overlayContainer);


    useEffect(() => {
        const body = document.body;
        function handleClickOutside(e: MouseEvent) {
            const menu = menuRef.current;
            const handler = handlerRef.current;
            const { clientX, clientY } = e;
            if (!menu || !handler || inside(clientX, clientY, menu) || inside(clientX, clientY, handler)) return;
            setOpen(false);
        }
        body.addEventListener("click", handleClickOutside);
        return () => body.removeEventListener("click", handleClickOutside);
    }, [setOpen]);

    return <>
        <PlusMenu anchor={anchor} overlayContainer={overlayContainer} items={items} nodeKey={nodeKey}
            ref={menuRef} open={open} onSelect={() => setOpen(false)} />
        <div className={styles.draggable} draggable={true} ref={handlerRef}
            onDragStart={onDragStart} onDragEnd={onDragEnd} tabIndex={-1}
            style={{ transform: `translate(calc(${pos.x - 8}px - 100%), calc(${pos.y}px - 50%))` }}>
            <Button size="large" contentEditable={false} type="text" icon={<PlusOutlined />} onClick={() => setOpen(true)} />
            <Button size="large" className={styles.handleButton} contentEditable={false} type="text" icon={<HolderOutlined />} />
        </div>
    </>
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