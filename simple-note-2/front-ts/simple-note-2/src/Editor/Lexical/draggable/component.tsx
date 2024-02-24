import { Flex, Popover, Input, List, Button, theme, InputRef, FlexProps } from "antd";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { PlusOutlined, HolderOutlined } from "@ant-design/icons";
import { dndStore, useDndSelector } from "./redux";
import { Provider } from "react-redux";
import styled from "styled-components";
import { LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// interface MenuContentProp{
//     onLeave: () => void;
//     sourceList: AddItem;
//     inputRef: React.Ref;
//     onChange: React.ChangeEventHandler<HTMLE>
// }
// const MenuContent: React.FC<MenuContentProp> = () => {
//     return <Flex vertical onBlur={onLeave}>
//         <Input ref={ref}
//             onChange={handleChange}
//             style={{ border: `1px solid ${token.colorPrimary}` }} />
//         <List
//             dataSource={result}
//             style={{ maxHeight: "250px", overflow: "auto" }}
//             rowKey={"value"}
//             renderItem={(item) => {
//                 return <List.Item style={{ padding: "0px" }}>
//                     <Button
//                         type="text"
//                         style={{ width: "100%", display: "flex", justifyContent: "left" }}
//                         icon={item.icon}
//                         onMouseDown={() => handleMouseDown(item)}
//                     >
//                         {item.label}
//                     </Button>
//                 </List.Item>
//             }} />
//     </Flex>
// };

export interface AddItem {
    value: string,
    label: React.ReactNode,
    icon: React.ReactNode,
    onSelect: (editor: LexicalEditor, item: AddItem) => void,
}
interface AddMenuProp {
    searchList: AddItem[],
    children: React.ReactNode,
    onSelect?: () => void,
    open?: boolean,
    onLeave?: () => void
}
const AddMenu: React.FC<AddMenuProp> = ({ searchList, children, onSelect, open, onLeave }) => {

    const [editor] = useLexicalComposerContext();
    const [keyword, setKeyword] = useState(/.*/);
    const { token } = theme.useToken();

    const ref = useRef<InputRef | null>(null);

    const filterData = useCallback((s: string) => keyword.test(s), [keyword]);

    const handleChange = useCallback((e: React.ChangeEvent) => {

        const text = ref.current!.input?.value;
        setKeyword(() => new RegExp(`${text}`));
    }, []);

    const handleMouseDown = useCallback((item: AddItem) => {
        item.onSelect?.(editor, item);
        onSelect?.();
    }, [editor, onSelect]);

    let result = searchList.filter(value => filterData(value.value));

    const content = <Flex vertical onBlur={onLeave}>
        <Input ref={ref}
            onChange={handleChange}
            style={{ border: `1px solid ${token.colorPrimary}` }} />
        <List
            dataSource={result}
            style={{ maxHeight: "250px", overflow: "auto" }}
            rowKey={"value"}
            renderItem={(item) => {
                return <List.Item style={{ padding: "0px" }}>
                    <Button
                        type="text"
                        style={{ width: "100%", display: "flex", justifyContent: "left" }}
                        icon={item.icon}
                        onMouseDown={() => handleMouseDown(item)}
                    >
                        {item.label}
                    </Button>
                </List.Item>
            }} />
    </Flex>

    return <Popover content={content} trigger={"click"}
        arrow={false} open={open}
        afterOpenChange={() => ref.current?.focus()}>
        {children}
    </Popover>
}

const HandleButton = styled(Button)`
    cursor: grab;
    font-size: 2em;
    &:active{
        cursor: grabbing;
    }
`

const FlexStyled = (prop: FlexProps) => <Flex draggable={true} {...prop} />
const Draggable = styled(FlexStyled)`
    position: absolute;
    &:active{
        opacity: 0.3;
    }
`
export interface DraggableElementProp extends Omit<FlexProps, "children" | "draggable"> {
    addList: AddItem[],
    style?: Omit<React.CSSProperties, "position" | "top" | "left">,
}
const DraggableElement = ({ addList, style, ...flexProps }: DraggableElementProp) => {
    const element = useDndSelector(state => state.dnd.element);
    const [open, setOpen] = useState(false);

    return <Draggable style={{
        top: element.top - 3,
        left: element.left,
        ...style
    }}
        className="draggable"
        {...flexProps}>
        <AddMenu
            searchList={addList}
            onSelect={() => setOpen(false)}
            open={open}
            onLeave={() => { console.log(1); setOpen(false) }}
        >
            <Button
                onClick={() => setOpen(prev => !prev)}
                contentEditable={false}
                type="text"
                size="small"
                icon={<PlusOutlined />}
            />
        </AddMenu>
        <HandleButton
            contentEditable={false}
            type="text"
            size="small"
            icon={<HolderOutlined />}
        />
    </Draggable>
}

export default DraggableElement;

const WrapperStyled = styled.div`position: relative;`;

export type DragWrapperProp = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "id">;
export const DragWrapper: React.FC<DragWrapperProp> = (prop) => <WrapperStyled id="dnd-wrapper" {...prop} />;

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

    return <div className="drop-line"
        style={{
            top: line.top,
            left: line.left,
            position: "absolute",
            ...style
        }} {...prop} />
}

export const DndProvider = ({ children }: { children: React.ReactNode }) => <Provider store={dndStore}>{children}</Provider>;