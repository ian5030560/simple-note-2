import React, { useCallback, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddMenu from "./addMenu";
import { Button, theme } from "antd";
import ElementHelper from "./helper";
import { useSlate } from "slate-react";
import ADDLIST from "../../../add";
import { PlusOutlined } from "@ant-design/icons";


const HandleButton = (prop) => {
    const [state, setState] = useState("grab");

    return <Button
        {...prop}
        style={{ cursor: state }}
        onMouseDown={() => setState("grabbing")}
        onMouseUp={() => setState("grab")}
    />;
}


const Element = (props) => {

    const [open, setOpen] = useState(false);
    const editor = useSlate();
    const {token} = theme.useToken();
    
    const {
        attributes,
        listeners,
        transform,
        setNodeRef,
        isSorting,
        newIndex,
        overIndex,
        isDragging,
        isOver,
        // activeIndex
    } = useSortable({
        id: props.element.id,
    });

    const touchTop = useCallback(() => {
        return isSorting && !isDragging && !isOver && (overIndex - newIndex) === -1 
    }, [isDragging, isOver, isSorting, newIndex, overIndex]);

    const touchBottom = useCallback(() => {
        return isSorting && !isDragging && !isOver && (overIndex - newIndex) === 1
    }, [isDragging, isOver, isSorting, newIndex, overIndex]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: null,
        display: "flex",
        outline: "none",
        alignItems: "center",
        borderTop: `${touchTop() ? 3: 0}px solid ${token.colorText}`,
        borderBottom: `${touchBottom() ? 3: 0}px solid ${token.colorText}`,
    }

    /**
     * 
     * @param {string} value 
     */
    const handleSelect = (value) => {
        ElementHelper.addElement(editor, value);
        setOpen(false);
    }

    return <div {...props.attributes}>
        <div ref={setNodeRef} style={style} {...attributes}>
            <AddMenu
                searchList={ADDLIST}
                onSelect={handleSelect}
                open={open}
                onLeave={() => setOpen(false)}>
                <Button
                    onClick={() => setOpen(prev => !prev)}
                    contentEditable={false}
                    type="text"
                    size="small"
                    icon=<PlusOutlined />
                />
            </AddMenu>
            <HandleButton
                contentEditable={false}
                {...listeners}
                type="text"
                size="small"
            >
                ⠿
            </HandleButton>
            {props.renderContent ? props.renderContent(props) : props.children.text}
        </div>
    </div>

}

export default Element;