import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddMenu from "./addMenu";
import { Button } from "antd";
import DefaultHelper from "./helper";
import { useSlate } from "slate-react";
import ADDLIST from "../../addList";
import { PlusOutlined } from "@ant-design/icons";
import { List } from "react-bootstrap-icons";

export const Default = (props) => {

    const [open, setOpen] = useState(false);
    const editor = useSlate();

    const {
        attributes,
        listeners,
        transform,
        setNodeRef
    } = useSortable({
        id: props.element.id
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: null,
        display: "flex",
        outline: "none",
        alignItems: "center",
    }

    /**
     * 
     * @param {string} key 
     */
    const handleSelect = (key) => {
        DefaultHelper.addElement(editor, key);
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
                    icon=<PlusOutlined />
                />
            </AddMenu>
            <Button
                contentEditable={false}
                {...listeners}
                type="text"
                icon=<List />
            />
            {/* ⠿ */}
            {props.renderContent ? props.renderContent(props) : props.children.text}
        </div>
    </div>

}

export default Default;