import React, { useState, useCallback, useMemo } from "react";
import { createEditor, Transforms, Text } from "slate";
import { Editable, Slate } from "slate-react";
import { DndContext, MouseSensor, useSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getId } from "./Slate/Plugin/withId";
import Element from "./Slate/Component/default/element";
import Toolbar from "./ToolBar";
import Leaf from "./Slate/Component/default/leaf";
import LEAF from "./Slate/leaf";
import withPlugin from "./Slate/plugin";
import handleKeyEvent from "./Slate/hotkey";
import ELEMENT from "./Slate/element";
import Overlay from "./Overlay";

const DATA = [
    {
        id: getId(),
        type: 'paragraph',
        children: [{ text: "" }],
    },
]

const Editor = ({ initlizeData, style }) => {
    const [editor] = useState(withPlugin(createEditor()));
    const [active, setActive] = useState();
    const [value, setValue] = useState(initlizeData ? initlizeData : DATA);
    const [search, setSearch] = useState("");
    // const sensor = useSensor(MouseSensor, {
    //     activationConstraint: {distance: 10}
    // })

    const renderElement = useCallback(props => {

        if (editor.isInline(props.element)) {
            return ELEMENT[props.element.type](props);
        }

        return <Element {...props} renderContent={ELEMENT[props.element.type]} />
    }, [editor])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} LEAF={LEAF} />
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

    const decorate = useCallback(([node, path]) => {
        const ranges = [];

        if (search && Text.isText(node)) {
            const { text } = node;
            const parts = text.split(search);
            let offset = 0;

            parts.forEach((part, i) => {
                if (i !== 0) {
                    ranges.push({
                        anchor: { path, offset: offset - search.length },
                        focus: { path, offset },
                        highlight: true,
                    })
                }

                offset = offset + part.length + search.length
            })
        }

        return ranges;

    }, [search]);

    return <Slate
        editor={editor}
        initialValue={value}
        onChange={setValue}
    >
        <Toolbar onSearch={setSearch} />
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    decorate={decorate}
                    onKeyDown={(e) => handleKeyEvent(e, editor)}
                    style={{ outline: "none", border: "none", ...style }}
                    disableDefaultStyles
                    spellCheck
                    autoFocus
                />
                {active && <Overlay id={active} />}
            </SortableContext>
        </DndContext>
    </Slate>
}

export default Editor;