import { Editor } from "slate";

const MarkHelper = {

    /**
     * 
     * @param {Editor} editor 
     * @param {string} type 
     * @returns 
     */
    isActive(editor, type) {
        const marks = Editor.marks(editor);
        return marks ? marks[type] === true : false;
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {string} type 
     * @returns 
     */
    toggleMark(editor, type) {
        const isActive = MarkHelper.isActive(editor, type);

        if (isActive) {
            Editor.removeMark(editor, type);
        }
        else {
            Editor.addMark(editor, type, true)
        }
    },
}

export default MarkHelper;