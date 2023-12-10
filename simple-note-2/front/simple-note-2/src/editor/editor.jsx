import React, { useState, useCallback, useMemo } from "react";
import { createEditor, Transforms, Editor as SlateEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { ELEMENTS } from "./element";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getId, withId } from "./plugin";
import { Sortable } from "./sortable/sortable";
import Overlay from "./overlay";
import Toolbar from "./toolbar";
import Leaf from "./leaf";

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
        {
            at: editor.selection
        }
    );
}

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
                    onKeyDown={(e) => {
                        if(!e.shiftKey) return;
                        if (e.key === "Enter") nextLine(editor); e.preventDefault();
                    }}
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