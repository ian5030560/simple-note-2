import { Editor, Transforms, Range, Path, Point } from "slate"

const ElementHelper = {
    /**
     * 
     * @param {Editor} editor 
     * @param {string} type 
     */
    addElement(editor, type) {

        Transforms.insertNodes(
            editor,
            { type: type, children: [{ text: "" }] },
            {
                at: [editor.children.length],
            }
        );
    }
}

export default ElementHelper;