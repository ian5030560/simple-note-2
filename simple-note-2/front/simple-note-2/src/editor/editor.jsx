import React, { useState, useCallback, useMemo } from "react";
import { createEditor, Transforms } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { ELEMENTS } from "./tools";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getId, withId } from "./plugin";
import { Sortable } from "./element/sortable";
import Overlay from "./overlay";
import Toolbar from "./tool/toolbar";
import Leaf from "./leaf/leaf";

const DATA = [
    {
        id: getId(),
        type: 'paragraph',
        children: [{ text: "" }],
    }
]

const Editor = ({ initlizeData }) => {
    const [editor] = useState(withId(withReact(createEditor())));
    const [active, setActive] = useState();
    const [value, setValue] = useState(initlizeData ? initlizeData : DATA);

    const renderElement = useCallback(props => <Sortable {...props} renderContent={ELEMENTS[props.element.type]} />, [])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
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