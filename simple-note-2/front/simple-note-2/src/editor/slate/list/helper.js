import { Node, Transforms } from "slate";
import { Editor, Element } from "slate";

const ListHelper = {

    name: "type",

    isActive(editor, type) {
        const { selection } = editor;

        if (!selection) return false;

        const [match] = Array.from(Editor.nodes(
            editor,
            {
                at: Editor.unhangRange(editor, selection),
                match: n => !Editor.isEditor(n) && Element.isElement(n) && n[this.name] === type
            }
        ))

        return !!match;
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {string} type 
     */
    toggleBlock(editor, type) {
        const isActive = this.isActive(editor, type);

        const nodes = Editor.nodes(editor, {match: n => Element.isElement(n)});
        let i = 1;
        for(let node of nodes) {
            Transforms.setNodes(
                editor,
                {type: !isActive ? type : "paragraph", index: !isActive && type === "ordered" ? i++ : undefined},
                {
                    at: editor.selection,
                    match: n => Element.isElement(n) && Node.matches(n, node[0])
                }
            )
        }
    }
}

export default ListHelper;