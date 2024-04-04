import { Flex, Button, Dropdown, MenuProps } from "antd";
import React, { useState, useEffect } from "react";
import { PlusOutlined, HolderOutlined } from "@ant-design/icons";
import { useDndState } from "./redux";
import { LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import styles from "./component.module.css";

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
    // const { token } = theme.useToken();
    const [editor] = useLexicalComposerContext();
    // const filterData = useCallback((s: string) => keyword.test(s), [keyword]);

    // const handleChange = useCallback(() => {
    //     const text = ref.current!.input?.value;
    //     ref.current?.focus();
    //     setKeyword(() => new RegExp(`${text}`));
    // }, []);

    const items: MenuProps["items"] = searchList.map(item => {
        return {
            key: item.value,
            label: item.label,
            icon: item.icon,
            onClick: () => item.onSelect(editor, item),
        }
    });

    return <Dropdown trigger={["click"]} arrow={false} menu={{ items }} placement="bottom"
        dropdownRender={(node) => React.cloneElement(node as React.JSX.Element, { className: styles.dropDown })}>
        {children}
    </Dropdown>
}

export interface DraggableElementProp {
    addList: AddItem[],
}
const DraggableElement = React.forwardRef((
    { addList }: DraggableElementProp, ref: React.Ref<HTMLElement>
) => {

    const { element } = useDndState();

    return <Flex
        ref={ref} className={styles.draggable} draggable={true}
        style={{ transform: `translate(${element.x}px, ${element.y}px)` }}
    >
        <AddMenu searchList={addList}>
            <Button
                contentEditable={false}
                type="text"
                size="small"
                icon={<PlusOutlined />}
            />
        </AddMenu>
        <Button
            className={styles.handleButton}
            contentEditable={false}
            type="text"
            size="small"
            icon={<HolderOutlined />}
        />
    </Flex>
})

export default DraggableElement;

export type DragWrapperProp = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "id">;
export const DragWrapper: React.FC<DragWrapperProp> = (prop) => <div id="dnd-wrapper" className={styles.wrapper} {...prop} />;

export const useWrapper = () => {
    const [wrapper, setWrapper] = useState<HTMLElement>();
    useEffect(() => {
        let root = document.getElementById("dnd-wrapper");
        if (!root) return;
        setWrapper(() => root!);
    }, []);
    return wrapper;
}

export const DropLine = () => {
    const { line } = useDndState();
    return <div className={styles.dropLine}
        style={{
            width: line.width, height: line.height,
            transform: `translate(${line.x}px, ${line.y}px)`
        }} />
}