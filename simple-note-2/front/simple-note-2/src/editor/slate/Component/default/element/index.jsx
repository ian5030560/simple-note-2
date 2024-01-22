import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddMenu from "./addMenu";
import { Button } from "antd";
import ElementHelper from "./helper";
import { useSlate } from "slate-react";
import ADDLIST from "../../../add";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';

const HandleButton = (prop) => {
    const [state, setState] = useState("grab");

    return <Button
        {...prop}
        style={{ cursor: state }}
        onMouseDown={() => setState("grabbing")}
        onMouseUp={() => setState("grab")}
    />;
}

const DragLine = ({ isDragging }) => {

    return <div style={{
        width: "100%",
        backgroundColor: "Highlight",
        height: isDragging ? "3px" : "0px",
        visibility: isDragging ? "visible" : "hidden",
        position: "absolute",
    }} contentEditable={false} />
}

const Wrapper = ({ children, isDragging, ...divProp }) => {
    const style = {
        minWidth: "100%",
        height: !isDragging ? "auto" : "0px"
    }

    return <div {...divProp} style={style}>
        {children}
    </div>
}

const Element = (props) => {

    const [open, setOpen] = useState(false);
    const editor = useSlate();

    const {
        attributes,
        listeners,
        transform,
        setNodeRef,
        isDragging,
        isSorting,
    } = useSortable({
        id: props.element.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: null,
        display: "flex",
        outline: "none",
        alignItems: "center",
        position: "relative",
        visibility: !(isDragging && isSorting) ? "visible" : "hidden",
        height: !(isDragging && isSorting) ? "auto" : "0px"
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
            <DragLine isDragging={isSorting && isDragging}/>
            <Wrapper id={props.element.id + "-content"} isDragging={isDragging && isSorting}>
                {props.renderContent ? props.renderContent(props) : props.children.text}
            </Wrapper>
        </div>
    </div>

}

Element.propTypes = {
    renderContent: PropTypes.func.isRequired,
}
export default Element;