import { Button, List, theme } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlusOutlined, HolderOutlined } from "@ant-design/icons";
import { useDndAction, useDndState } from "./store";
import { LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import styles from "./component.module.css";
import { createPortal } from "react-dom";
import { getBlockFromPoint } from "./util";
import { eventFiles } from "@lexical/rich-text";

export interface PlusItem {
    value: string,
    label: React.ReactNode,
    icon: React.ReactNode,
    onSelect: (editor: LexicalEditor, item: PlusItem) => void,
}

function usePlusMenu(itemList: PlusItem[]): [() => void, React.JSX.Element, React.RefObject<HTMLElement>] {
    const [editor] = useLexicalComposerContext();
    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);
    const [element, setElement] = useState<HTMLElement | null>(null);
    const trigger = useRef<HTMLElement>(null);
    const ref = useRef<HTMLDivElement>(null);

    const show = useCallback(() => {

        let scroller = document.getElementById("editor-scroller");
        if (!trigger.current || !scroller) return;

        let { x, y, width, height } = trigger.current.getBoundingClientRect();
        let el = getBlockFromPoint(editor, x + width, y + height / 2, scroller);

        if (!el) return;
        setOpen(true);
        setElement(el);
    }, [editor]);

    const hide = useCallback(() => {
        setOpen(false);
        setElement(null);
    }, []);

    useEffect(() => {
        if (!element) return;
        let resizer = new ResizeObserver(() => {
            if (!ref.current) return;
            let { x, y, height } = element.getBoundingClientRect();
            ref.current.style.transform = `translate(${x}px, ${y + height + 5}px)`;
        });
        resizer.observe(element);

        return () => {
            resizer.unobserve(element);
            resizer.disconnect();
        }
    }, [element]);

    useEffect(() => {
        function handleLeave(e: MouseEvent) {
            let target = e.target as HTMLElement;
            if (trigger.current === target || trigger.current?.contains(target)) return;
            hide();
        }
        document.addEventListener("click", handleLeave);
        return () => document.removeEventListener("click", handleLeave);
    }, [hide]);

    const handleSelect = useCallback((item: PlusItem) => {
        item.onSelect(editor, item);
        hide();
    }, [editor, hide]);

    const context = useMemo(() => {
        let main = document.getElementById("editor-scroller")?.parentElement;
        return <>
            {
                main && createPortal(<div className={styles.dropDown} ref={ref}
                    style={{
                        maxHeight: !open ? 0 : 250, opacity: !open ? 0 : undefined,
                        backgroundColor: token.colorBgBase
                    }}>
                    <List renderItem={(item) => <List.Item key={item.value} style={{ width: "100%", padding: 0 }}>
                        <Button icon={item.icon} block type="text" style={{ justifyContent: "flex-start" }}
                            onClick={() => handleSelect(item)}>{item.label}</Button>
                    </List.Item>} dataSource={itemList} />
                </div>, main)
            }
        </>
    }, [handleSelect, itemList, open, token.colorBgBase]);

    const toggle = useCallback(() => open ? hide() : show(), [hide, open, show]);

    return [toggle, context, trigger];
}

const HEIGHT = 3;
const DraggableElement = (props: { plusList: PlusItem[] }) => {

    const { element, id } = useDndState();
    const { setLine, reset } = useDndAction();
    const [toggle, context, trigger] = usePlusMenu(props.plusList);
    const [editor] = useLexicalComposerContext();

    const handleDragStart = useCallback((e: React.DragEvent) => {

        if (eventFiles(e.nativeEvent)[0]) return;

        if (!e.dataTransfer || !id) return;
        const element = editor.getElementByKey(id)!;
        e.dataTransfer.setDragImage(element, 0, 0);

        let { width } = element.getBoundingClientRect();
        setLine({ width: width, height: HEIGHT });

    }, [editor, id, setLine]);

    const handleDragEnd = useCallback(() => {
        reset("element");
        reset("id");
        reset("line");
    }, [reset]);

    return <>
        {
            element && <div className={styles.draggable} draggable={true}
                onDragStart={handleDragStart} onDragEnd={handleDragEnd}
                style={{ transform: `translate(calc(${element.x}px - 100%), calc(${element.y}px - 50%))` }}>
                <Button contentEditable={false} type="text" icon={<PlusOutlined />}
                    onClick={toggle} ref={trigger as React.RefObject<HTMLButtonElement>} />
                <Button className={styles.handleButton} contentEditable={false} type="text" icon={<HolderOutlined />} />
            </div>
        }
        {context}
    </>;
}

export default DraggableElement;

export const DndAnchor = ({children}: {children: React.ReactNode}) => <div id="dnd-anchor" className={styles.anchor}>{children}</div>;

export const useAnchor = () => {
    const [anchor, setWrapper] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setWrapper(document.getElementById("dnd-anchor"));

        return () => setWrapper(null);
    }, [])

    return anchor;
}

export const DropLine = () => {
    const { line } = useDndState();
    return <>
        {
            line?.x !== undefined && <div className={styles.dropLine}
                style={{
                    width: line.width, height: line.height,
                    transform: `translate(${line.x}px, ${line.y}px)`
                }} />
        }
    </>;
}