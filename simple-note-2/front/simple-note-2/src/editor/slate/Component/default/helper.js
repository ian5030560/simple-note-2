import { Editor, Transforms } from "slate"

const DefaultHelper = {
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
                at: [editor.children.length]
            }
        );
    }
}

export default DefaultHelper;