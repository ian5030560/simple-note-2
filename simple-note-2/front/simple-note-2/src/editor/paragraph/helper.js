import { Editor, Element, Transforms } from "slate";

export const AlignHelper = {

    name: "align",

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

    toggleBlock(editor, type) {
        const isActive = this.isActive(editor, type);
    
        Transforms.setNodes(
            editor,
            { align: isActive ? undefined : type },
            {
                at: Editor.unhangRange(editor, editor.selection),
            }
        )
    }
}