import { Flex, Popover, Input, List, Button, theme, InputRef, ButtonProps, FlexProps } from "antd";
import React, { useState, useRef, useCallback, forwardRef, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { createPortal } from "react-dom";

interface AddItem {
    value: string,
    label: string,
    handler?: (value: string) => any,
}

interface AddMenuProp {
    searchList: AddItem[],
    children: React.ReactNode,
    onSelect?: (value: string, result: any) => void,
    open?: boolean,
    onLeave?: (e: React.FocusEvent) => void
}
const AddMenu: React.FC<AddMenuProp> = ({ searchList, children, onSelect, open, onLeave }) => {

    const [keyword, setKeyword] = useState(/.*/);
    const { token } = theme.useToken();

    const ref = useRef<InputRef | null>(null);

    const filterData = useCallback((s: string) => keyword.test(s), [keyword]);

    const handleChange = useCallback((e: React.ChangeEvent) => {
        const text = e.target.nodeValue;
        setKeyword(() => new RegExp(`${text}`));
    }, []);

    const handleMouseDown = useCallback((item: AddItem) => {
        const result = item.handler?.(item.value);
        onSelect?.(item.value, result);
    }, [onSelect]);

    searchList = searchList.filter(value => filterData(value.label));

    const content = <Flex vertical onBlur={onLeave}>
        <Input ref={ref}
            onChange={handleChange}
            style={{ border: `1px solid ${token.colorPrimary}` }} />
        <List
            dataSource={searchList}
            style={{ maxHeight: "250px", overflow: "auto" }}
            renderItem={(item) => {

                return <List.Item key={item.value} style={{ padding: "0px" }}>
                    <Button
                        type="text"
                        style={{ width: "100%" }}
                        onMouseDown={() => handleMouseDown(item)}
                    >{item.label}</Button>
                </List.Item>
            }} />
    </Flex>

    return <Popover content={content} trigger={"click"}
        arrow={false} open={open}
        afterOpenChange={() => ref.current?.focus()}>
        {children}
    </Popover>
}

const HandleButton = (prop: ButtonProps) => {
    const [state, setState] = useState("grab");

    return <Button
        {...prop}
        style={{ cursor: state }}
        onMouseDown={() => setState("grabbing")}
        onMouseUp={() => setState("grab")}
    />;
}

export interface DraggableElementProp extends Omit<FlexProps, "children">{
    addList?: any[],
    style?: Omit<React.CSSProperties, "position">,
}
const DraggableElement = forwardRef(({ addList, style, ...flexProps }: DraggableElementProp, ref: React.Ref<HTMLElement>) => {
    return <Flex style={{
        position: "absolute",
        ...style
    }} ref={ref} {...flexProps}>
        <AddMenu
            searchList={addList || []}
        // onSelect={handleSelect}
        // open={open}
        // onLeave={() => setOpen(false)}
        >
            <Button
                // onClick={() => setOpen(prev => !prev)}
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
        >
            ⠿
        </HandleButton>
    </Flex>
})

export default DraggableElement;

export type DragWrapperProp = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "id">;
export const DragWrapper: React.FC<DragWrapperProp> = (prop) => <div id="dnd-wrapper" {...prop}/>;


export type DropLineProp = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "id" | "children">;
export const DropLine: React.FC<DropLineProp> = (prop) => {
    return <div id = "drop-line" {...prop}/>
}