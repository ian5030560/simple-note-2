import React, { useState, useCallback, useMemo } from "react";
import { createEditor, Transforms, Editor as SlateEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import TOOLS from "./tools";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { getId, withId } from "./plugin";
import { Sortable } from "./element/default";
const Leaf = props => {
    return (
        <span
            {...props.attributes}
            style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
        >
            {props.children}
        </span>
    )
}

const CustomEditor = {
    isBoldMarkActive(editor) {
        const marks = SlateEditor.marks(editor)
        return marks ? marks.bold === true : false
    },

    isCodeBlockActive(editor) {
        const [match] = SlateEditor.nodes(editor, {
            match: n => n.type === 'code',
        })

        return !!match
    },

    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        if (isActive) {
            SlateEditor.removeMark(editor, 'bold')
        } else {
            SlateEditor.addMark(editor, 'bold', true)
        }
    },

    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'code' },
            { match: n => SlateEditor.isBlock(editor, n) }
        )
    },
}

const DATA = [
    {
        id: getId(),
        type: 'paragraph',
        children: [{ text: "" }],
    }
]


const Editor = ({ initlizeData }) => {
    const editor = useMemo(() => withId(withReact(createEditor())), []);
    const [active, setActive] = useState();

    const renderElement = useCallback(props => {
        return <Sortable {...props} renderContent={TOOLS[props.element.type]} />;
    }, [])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    const items = useMemo(() => {
        return editor.children.map(element => element.id);
    }, [editor.children])

    const handleDragStart = (e) => {
        setActive(() => e.active);
    }

    const handleDragEnd = (e) => {
        const overId = e.over?.id;
        const overIndex = editor.children.findIndex((x) => x.id === overId);

        if (overId !== active && overIndex !== -1) {
            Transforms.moveNodes(editor, {
                at: [],
                match: (node) => {
                    console.log(node.id, active);
                    return node.id === active
                },
                to: [overIndex]
            });
        }

        setActive(null);
    }

    return <Slate editor={editor} initialValue={initlizeData ? initlizeData : DATA}>
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={event => {
                        if (!event.ctrlKey) {
                            return
                        }

                        switch (event.key) {
                            // When "`" is pressed, keep our existing code block logic.
                            case '`': {
                                event.preventDefault()
                                CustomEditor.toggleCodeBlock(editor)
                                break
                            }

                            // When "B" is pressed, bold the text in the selection.
                            case 'b': {
                                event.preventDefault()
                                CustomEditor.toggleBoldMark(editor)
                                break
                            }

                            default: break;
                        }
                    }} />
            </SortableContext>
        </DndContext>

    </Slate>
}

export default Editor;