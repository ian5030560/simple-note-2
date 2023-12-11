import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Sortable = (props) => {

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
    }

    return <div {...props.attributes}>
        <div ref={setNodeRef} style={style} {...attributes}>
            <button
                contentEditable={false}
                type="button"
                style={{
                    background: "none",
                    border: "none",
                    userSelect: "none",
                }}
            >
            +
            </button>
            <button
                contentEditable={false}
                {...listeners}
                type="button"
                style={{
                    background: "none",
                    border: "none",
                    userSelect: "none",
                }}
            >
                ⠿
            </button>
            {props.renderContent ? props.renderContent(props): props.children.text}
        </div>
    </div>

}

export default Sortable;