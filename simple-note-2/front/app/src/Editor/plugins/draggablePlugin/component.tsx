import { Button, List, theme } from "antd";
import styles from "./component.module.css";
import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import { createPortal } from "react-dom";
import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { $getNodeByKey, NodeKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { getBlockFromPoint } from "./getBlockFromPoint";
import { inside, useAnchor } from "../../utils";
import { PLUSMENU_SELECTED } from "./command";

export interface PlusItem {
    value: string;
    label: string;
    icon: React.ReactNode;
}

interface PlusMenuProps {
    items: PlusItem[];
    nodeKey: NodeKey;
    onSelect: () => void;
    mask: React.LegacyRef<HTMLDivElement>;
}
const PlusMenu = forwardRef(({ items, nodeKey, onSelect, mask }: PlusMenuProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const anchor = useAnchor();
    const { token } = theme.useToken();
    const [pos, setPos] = useState<{ x: number, y: number }>();
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const element = editor.getElementByKey(nodeKey);
        if (!element || !anchor) return;

        function update() {
            const { x, y: _y, height } = element!.getBoundingClientRect();
            // const {height: bh} = document.body.getBoundingClientRect();
            const y = _y + height + 8;
            setPos({ x, y });
            // if(y + height <= bh) {
            //     setPos({ x, y });
            // }
            // else{
            //     const mask = document.getElementById("menu-mask")!;
            //     if(!mask) return;
            //     const {height: mh} = mask.getBoundingClientRect();
            //     setPos({x, y: _y - mh - 8});
            // }
        }

        const resizer = new ResizeObserver(update);
        resizer.observe(element);

        return () => {
            resizer.unobserve(element);
            resizer.disconnect();
        }
    }, [anchor, editor, nodeKey]);

    return pos ? createPortal(<div className={styles.mask} id="menu-mask" ref={mask}>
        <div style={{ position: "relative" }}>
            <div className={styles.dropDown} ref={ref}
                style={{
                    backgroundColor: token.colorBgBase,
                    transform: `translate(${pos.x}px, ${pos.y}px)`
                }}>
                <List renderItem={(item) => <List.Item key={item.value} style={{ width: "100%", padding: 0 }}>
                    <Button icon={item.icon} block type="text" style={{ justifyContent: "flex-start" }}
                        onClick={() => {
                            onSelect();
                            const node = editor.getEditorState().read(() => $getNodeByKey(nodeKey));
                            if(!node) return;

                            editor.dispatchCommand(PLUSMENU_SELECTED, {node: node, value: item.value})
                        }}>
                        {item.label}
                    </Button>
                </List.Item>} dataSource={items} />
            </div>
        </div>
    </div>, document.body) : null;
})

interface DragHandlerProps {
    pos: { x: number, y: number };
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    items: PlusItem[];
    mask: React.LegacyRef<HTMLDivElement>;
}
export const DragHandler = ({ pos, onDragStart, onDragEnd, items, mask }: DragHandlerProps) => {
    const [nodeKey, setNodeKey] = useState<NodeKey>();
    const [editor] = useLexicalComposerContext();
    const menuRef = useRef<HTMLDivElement>(null);
    const handlerRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((e: MouseEvent) => {
        const menu = menuRef.current;
        const handler = handlerRef.current;
        const { clientX, clientY } = e;
        if (!menu || !handler || inside(clientX, clientY, menu) || inside(clientX, clientY, handler)) return;
        setNodeKey(undefined);
    }, []);

    useEffect(() => {
        const body = document.body;
        body.addEventListener("click", handleClickOutside);
        return () => body.removeEventListener("click", handleClickOutside);
    }, [handleClickOutside]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        const scroller = document.getElementById('editor-scroller');
        if (!scroller) return;
        const { clientX, clientY } = e;
        const id = getBlockFromPoint(editor, clientX, clientY, scroller);
        if (id) setNodeKey(id);

    }, [editor]);

    return <>
        {nodeKey && <PlusMenu mask={mask} items={items} nodeKey={nodeKey} ref={menuRef} onSelect={() => setNodeKey(undefined)} />}
        <div className={styles.draggable} draggable={true} ref={handlerRef}
            onDragStart={onDragStart} onDragEnd={onDragEnd} tabIndex={-1}
            style={{ transform: `translate(calc(${pos.x - 8}px - 100%), calc(${pos.y}px - 50%))` }}>
            <Button size="large" contentEditable={false} type="text" icon={<PlusOutlined />} onClick={handleClick} />
            <Button size="large" className={styles.handleButton} contentEditable={false} type="text" icon={<HolderOutlined />} />
        </div>
    </>
};

interface DragLineProps {
    pos: { x: number, y: number };
    size: { width: number, height: number };
}
export const DragLine = ({ pos, size }: DragLineProps) => {

    return <div className={styles.dropLine}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, width: size.width, height: size.height }} />
}