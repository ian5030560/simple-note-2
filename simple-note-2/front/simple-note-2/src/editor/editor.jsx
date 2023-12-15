import React, { useState, useCallback, useMemo } from "react";
import { createEditor, Transforms } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { ELEMENTS, INLINE_ELEMENTS } from "./element";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getId } from "./withId";
import Default from "./node/default/index";
import Overlay from "./overlay";
import Toolbar from "./component/toolbar";
import Leaf from "./node/leaf/leaf";
import LEAF from "./leaf";
import withPlugin from "./plugin";
import handleKeyEvent from "./keyEvent";

const DATA = [
    {
        id: getId(),
        type: 'paragraph',
        children: [{ text: "" }],
    }
]

const Editor = ({ initlizeData }) => {
    const [editor] = useState(withPlugin(withReact(createEditor())));
    const [active, setActive] = useState();
    const [value, setValue] = useState(initlizeData ? initlizeData : DATA);
    
    const renderElement = useCallback(props => {
        if(editor.isInline(props.element)){
            return INLINE_ELEMENTS[props.element.type](props);
        }
        return <Default {...props} renderContent={ELEMENTS[props.element.type]} />
    }, [editor])

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
                <Editable                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={(e) => handleKeyEvent(e, editor)}
                    style={{outline: "none", border: "none"}}
                    disableDefaultStyles
                    spellCheck
                    autoFocus
                />
            </SortableContext>
            {/* <DragOverlay dropAnimation={null} adjustScale={false}> */}
                {/* {active && <Overlay/>} */}
            {/* </DragOverlay> */}
        </DndContext>
    </Slate>
}

export default Editor;