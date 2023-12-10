import { Editor, Element, Transforms } from "slate";

const BlockHelper = {
    name: "",

    isActive(editor, type) {
        const { selection } = editor;

        if (!selection) return false;

        const match = Array.from(Editor.nodes(
            editor,
            {
                at: Editor.unhangRange(editor, selection),
                match: n => !Editor.isEditor(n) && Element.isElement(n) && n[this.name] === type
            }
        ))

        return match.length === 1;
    },

    toggleBlock(editor, type) { }
}

export const AlignHelper = {

    __proto__: BlockHelper,

    name: "align",

    toggleBlock(editor, type) {
        const isActive = this.isActive(editor, type);
        console.log(isActive);
        Transforms.setNodes(
            editor,
            { align: isActive ? undefined : type },
            {
                at: Editor.unhangRange(editor, editor.selection),
            }
        )
    }
}

export const OrderHelper = {

    __proto__: BlockHelper,

    name: "type",

    toggleBlock(editor, type) {
        const isActive = this.isActive(editor, type);
        const LIST = ["ordered", "unordered"];
        const isList = LIST.includes(type);

        Transforms.unwrapNodes(
            editor,
            {
                match: n => {

                    return !Editor.isEditor(n) && Element.isElement(n) && isList
                },
                split: true
            }
        )
        
        Transforms.setNodes(
            editor,
            {
                type: isActive ? "paragraph" : isList ? "list-item" : type,
            }
        )

        if (!isActive && isList) {
            const block = { type: type, children: [] }
            Transforms.wrapNodes(editor, block)
        }
    }
}