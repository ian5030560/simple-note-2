import { Flex, Button, FlexProps, Dropdown, MenuProps, Select } from "antd";
import React, { useState, useEffect } from "react";
import { PlusOutlined, HolderOutlined } from "@ant-design/icons";
import { dndStore, useDndSelector } from "./redux";
import { Provider } from "react-redux";
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

export interface DraggableElementProp extends Omit<FlexProps, "children" | "draggable"> {
    addList: AddItem[],
    style?: Omit<React.CSSProperties, "position" | "top" | "left">,
}
const DraggableElement = ({ addList, style, ...flexProps }: DraggableElementProp) => {
    const element = useDndSelector(state => state.dnd.element);

    return <Flex
        style={{
            top: element.top - 3,
            left: element.left,
            ...style
        }}
        className={styles.draggable}
        draggable={true}
        {...flexProps}>
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
}

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

export interface DropLineProp extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "id" | "children"> {
    style?: Omit<React.CSSProperties, "top" | "left" | "position">
}
export const DropLine: React.FC<DropLineProp> = ({ style, ...prop }) => {
    const line = useDndSelector(state => state.dnd.line);

    return <div className={styles.dropLine}
        style={{
            top: line.top,
            left: line.left,
            position: "absolute",
            ...style
        }} {...prop} />
}

export const DndProvider = ({ children }: { children: React.ReactNode }) => <Provider store={dndStore}>{children}</Provider>;