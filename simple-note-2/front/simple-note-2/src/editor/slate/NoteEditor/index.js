import { Editor, Location, Element, EditorNodesOptions, Node, before } from "slate";
import { ReactEditor } from "slate-react";

const NoteEditor = {
    ...Editor,
    ...ReactEditor,

    /**
     * 
     * @param {Editor} editor 
     * @param {Location} at 
     * @param {EditorNodesOptions<Node>} options 
     */
    previousElement(editor, at, options) {
        const beforePoint = editor.before(at);
        return this.element(editor, beforePoint, options);
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {Location} at 
     * @param {EditorNodesOptions<Node>} options 
     */
    element(editor, at, options) {
        const [[prevElement]] = Array.from(
            editor.nodes({
                at: at,
                match: n => Element.isElement(n),
                options: options
            },
        ));

        return prevElement
    }
}

export default NoteEditor;