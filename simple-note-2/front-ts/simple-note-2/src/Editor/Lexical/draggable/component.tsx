import { Flex, Popover, Input, List, Button, theme, InputRef, FlexProps } from "antd";
import React, { useState, useRef, useCallback, useEffect, useMemo, cloneElement } from "react";
import { PlusOutlined, HolderOutlined } from "@ant-design/icons";
import { dndStore, useDndSelector } from "./redux";
import { Provider } from "react-redux";
import { LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import styles from "./component.module.css";

// interface SearchResultProp<T> {
//     resultList: T[],
//     renderItem: (value: T) => React.ReactNode,
//     show: boolean,
//     children: React.ReactNode,
//     rowKey: keyof T
// }
// function SearchResult<T>(prop: SearchResultProp<T>) {

//     const content = <List
//         dataSource={prop.resultList}
//         rowKey={prop.rowKey}
//         style={{ maxHeight: "250px", overflow: "auto" }}
//         renderItem={(item) => <List.Item style={{ padding: "0px" }}>
//             {prop.renderItem(item)}
//         </List.Item>} />;

//     return <Popover style={{width: "100%"}} arrow={false} content={content} open={prop.show}>
//         {prop.children}
//     </Popover>
// }
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

    const [editor] = useLexicalComposerContext();
    // const [keyword, setKeyword] = useState(/.*/);
    // const { token } = theme.useToken();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLElement>(null);

    // const filterData = useCallback((s: string) => keyword.test(s), [keyword]);

    // const handleChange = useCallback(() => {
    //     const text = ref.current!.input?.value;
    //     ref.current?.focus();
    //     setKeyword(() => new RegExp(`${text}`));
    // }, []);

    const handleMouseDown = useCallback((item: AddItem) => {
        item.onSelect?.(editor, item);
        setOpen(false);
    }, [editor]);

    let result = searchList;
    // let result = searchList.filter(value => filterData(value.value));

    // const content = <Flex vertical>
    //     <SearchResult
    //         resultList={result}
    //         renderItem={(item) => <Button
    //             type="text"
    //             style={{ width: "100%", display: "flex", justifyContent: "left" }}
    //             icon={item.icon}
    //             onMouseDown={() => handleMouseDown(item)}
    //         >
    //             {item.label}
    //         </Button>}

    //         rowKey={"value"}
    //         show={open}
    //     >
    //         <Input ref={ref}
    //             onBlur={() => setOpen(() => false)}
    //             onChange={handleChange}
    //             autoFocus
    //             style={{ border: `1px solid ${token.colorPrimary}` }} />
    //     </SearchResult>
    // </Flex> 

    const handleExit = useCallback((e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleExit);
        return () => document.removeEventListener("mousedown", handleExit);
    }, [handleExit]);

    const content = <Flex justify="center" ref={ref}>
        <List   
            dataSource={result}
            rowKey={"value"}
            style={{ maxHeight: "250px", overflow: "auto" }}
            renderItem={(item) => <List.Item style={{ padding: "0px" }}>
                <span className={styles.addListItem} onMouseDown={() => handleMouseDown(item)}>
                    {cloneElement(item.icon as React.JSX.Element, {
                        className: styles.addListItemIcon
                    })}
                    {item.label}
                </span>
            </List.Item>} />
    </Flex>

    return <Popover trigger={"click"}
        arrow={false} open={open}
        afterOpenChange={(open) => open ? ref.current?.focus() : undefined}
        content={content}>
        {
            cloneElement(children as React.JSX.Element, {
                onClick: () => setOpen(!open)
            })
        }
    </Popover>
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
            className={styles["handle-button"]}
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