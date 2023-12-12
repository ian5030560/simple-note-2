import React, { useState, useCallback, useMemo } from "react";
import { createEditor, Transforms } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { ELEMENTS } from "./element";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getId, withId } from "./withId";
import { Sortable } from "./sortable/sortable";
import Overlay from "./overlay";
import Toolbar from "./component/toolbar";
import Leaf from "./leaf/leaf";
import LEAF from "./leaf";
import withList from "./list/withList";
import { withHistory } from "slate-history";

const DATA = [
    {
        id: getId(),
        type: 'paragraph',
        children: [{ text: "" }],
    }
]

/**
 * 
 * @param {SlateEditor} editor 
 */
function nextLine(editor) {
    Transforms.insertText(
        editor,
        "\n",
    );
}

const Editor = ({ initlizeData }) => {
    const [editor] = useState(withId(withHistory(withReact(createEditor()))));
    const [active, setActive] = useState();
    const [value, setValue] = useState(initlizeData ? initlizeData : DATA);

    const renderElement = useCallback(props => {
        if(props.element.type === "list-item"){
            return ELEMENTS[props.element.type](props);
        }

        return <Sortable {...props} renderContent={ELEMENTS[props.element.type]} />
    }, [])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} LEAF={LEAF}/>
    }, [])

    const items = useMemo(() => {
        return editor.children.map(element => element.id);
    }, [editor.children])


    const handleDragStart = (e) => {
        setActive(() => e.active.id);
    }

    const handleDragEnd = (e) => {

        const overId = e.over?.id;
        const overIndex = editor.children.findIndex((x) => x.id === overId);

        if (overId !== active && overIndex !== -1) {
            Transforms.moveNodes(editor, {
                at: [],
                match: (node) => node.id === active,
                to: [overIndex]
            });
        }
        setActive(() => null);
    }

    return <Slate
        editor={editor}
        initialValue={value}
        onChange={setValue}
    >
        <Toolbar />
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={(e) => {
                        if(!e.shiftKey) return;
                        if (e.key === "Enter") nextLine(editor); e.preventDefault();
                    }}
                    style={{outline: "none", border: "none"}}
                    disableDefaultStyles
                    spellCheck
                    autoFocus
                />
            </SortableContext>
            {/* <DragOverlay dropAnimation={null}>
                {active && <Overlay/>}
            </DragOverlay> */}
        </DndContext>
    </Slate>
}

export default Editor;