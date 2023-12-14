import { Transforms } from "slate";
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
        const LIST = ["ordered", "unordered"];

        Transforms.unwrapNodes(
            editor,
            {
                match: n => LIST.includes(n.type),
                split: true
            }
        )

        Transforms.setNodes(
            editor,
            {type: isActive ? "paragraph" : LIST.includes(type) ? "list-item": type}
        )

        if(!isActive && LIST.includes(type)){
            Transforms.wrapNodes(
                editor,
                {type: type, children: []}
            )
        }
    }
}

export default ListHelper;