import React, { useCallback, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddMenu from "./addMenu";
import { Button, theme } from "antd";
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

const Element = (props) => {

    const [open, setOpen] = useState(false);
    const editor = useSlate();
    const { token } = theme.useToken();
    const [top, setTop] = useState(false);
    const [bottom, setBottom] = useState(false);

    const {
        attributes,
        listeners,
        transform,
        setNodeRef,
        // rect
    } = useSortable({
        id: props.element.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: null,
        display: "flex",
        outline: "none",
        alignItems: "center",
        // borderTop: `${top ? 3 : 0}px solid ${token.colorText}`,
        // borderBottom: `${bottom ? 3 : 0}px solid ${token.colorText}`,
    }

    const handleMouseEnter = () => {
        // console.log(rect.current);
    }

    const handleMouseMove = () => {

    }

    const handleMouseLeave = () => {

    }

    /**
     * 
     * @param {string} value 
     */
    const handleSelect = (value) => {
        ElementHelper.addElement(editor, value);
        setOpen(false);
    }

    return <div {...props.attributes}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}>
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
            <div style={{minWidth: "100%"}} id={props.element.id + "-content"}>
                {props.renderContent ? props.renderContent(props) : props.children.text}
            </div>
            
        </div>
    </div>

}

Element.propTypes = {
    renderContent: PropTypes.func.isRequired,
}
export default Element;