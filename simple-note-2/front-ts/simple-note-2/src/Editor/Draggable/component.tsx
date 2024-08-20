import { Flex, Button, List, theme } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlusOutlined, HolderOutlined } from "@ant-design/icons";
import { useDndState } from "./store";
import { LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import styles from "./component.module.css";
import { createPortal } from "react-dom";


export interface AddItem {
    value: string,
    label: React.ReactNode,
    icon: React.ReactNode,
    onSelect: (editor: LexicalEditor, item: AddItem) => void,
}
interface AddMenuProp {
    searchList: AddItem[],
    children: React.ReactNode,
}
const AddMenu: React.FC<AddMenuProp> = ({ searchList, children }) => {
    // const [keyword, setKeyword] = useState(/.*/);
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { token } = theme.useToken();
    const cRef = useRef<HTMLElement>(null);
    // const filterData = useCallback((s: string) => keyword.test(s), [keyword]);

    // const handleChange = useCallback(() => {
    //     const text = ref.current!.input?.value;
    //     ref.current?.focus();
    //     setKeyword(() => new RegExp(`${text}`));
    // }, []);

    useEffect(() => {
        function handleLeave(e: MouseEvent) {
            setOpen(prev => (ref.current?.contains(e.target as Node | null) || cRef.current?.contains(e.target as Node | null) ? prev : false))
        }

        document.addEventListener("click", handleLeave);
        return () => document.removeEventListener("click", handleLeave);
    }, []);

    const handleSelect = useCallback((item: AddItem) => {
        item.onSelect(editor, item);
        setOpen(false);
    }, [editor]);

    const content = useMemo(() => <div className={styles.dropDown} ref={ref}
        style={{ maxHeight: !open ? 0 : 250, backgroundColor: token.colorBgBase }}>
        <List renderItem={(item) => <List.Item key={item.value} style={{ width: "100%", padding: 0 }}>
            <Button icon={item.icon} block type="text" style={{ justifyContent: "flex-start" }}
                onClick={() => handleSelect(item)}>{item.label}</Button>
        </List.Item>} dataSource={searchList} />
    </div>, [handleSelect, open, searchList, token.colorBgBase]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        let element = ref.current;
        let target = e.target as HTMLElement;
        let { height, x, y } = target.getBoundingClientRect();
        let { width } = element.getBoundingClientRect();
        element.style.transform = `translate(${x - width / 2}px, ${y + height + 8}px)`
        setOpen(prev => !prev);
    }, []);

    return <>
        {React.cloneElement(children as React.JSX.Element, { onClick: handleClick, ref: cRef })}
        {createPortal(content, document.body)}
    </>
}

export interface DraggableElementProp {
    addList: AddItem[];
}
const DraggableElement = React.forwardRef((props: DraggableElementProp, ref: React.Ref<HTMLElement>) => {

    const { element } = useDndState();

    let x = element ? element.x : -10000;
    let y = element ? element.y : -10000;
   
    return <Flex className={styles.draggable} draggable={true}
        ref={ref} style={{ transform: `translate(${x}px, ${y}px)` }}>
        <AddMenu searchList={props.addList}>
            <Button contentEditable={false} type="text"
                size="small" icon={<PlusOutlined />} />
        </AddMenu>
        <Button className={styles.handleButton}
            contentEditable={false} type="text"
            size="small" icon={<HolderOutlined />}
        />
    </Flex>;
})

export default DraggableElement;

export type DragWrapperProp = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "id">;
export const DragWrapper: React.FC<DragWrapperProp> = (prop) => <div id="dnd-wrapper" className={styles.wrapper} {...prop} />;

export const useWrapper = () => {
    const [wrapper, setWrapper] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setWrapper(document.getElementById("dnd-wrapper"));

        return () => setWrapper(null);
    }, [])

    return wrapper;
}

export const DropLine = () => {
    const { line } = useDndState();

    let x = line ? line.x : -10000;
    let y = line ? line.y : -10000;
    return <div className={styles.dropLine}
        style={{ width: line?.width, height: line?.height, transform: `translate(${x}px, ${y}px)` }} />;
}