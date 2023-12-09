import { Editor } from "slate";

const FORMAT_TYPE = {
    BOLD: "bold",
    ITALIC: "italic",
}

const FormatHelper = {

    /**
     * 
     * @param {Editor} editor 
     * @param {string | FORMAT_TYPE} type 
     * @returns 
     */
    isActive(editor, type) {
        const marks = Editor.marks(editor);
        return marks ? marks[type] : false;
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {string | FORMAT_TYPE} type 
     * @returns 
     */
    toggleMark(editor, type) {
        const isActive = FormatHelper.isActive(editor, type);

        // let s = editor.selection;
        if (isActive) {
            Editor.removeMark(editor, type);
        }
        else {
            Editor.addMark(editor, type, true)
        }
        // editor.setSelection(s);
    },
}

export const Format = {
    Helper: FormatHelper,
    Type: FORMAT_TYPE
}