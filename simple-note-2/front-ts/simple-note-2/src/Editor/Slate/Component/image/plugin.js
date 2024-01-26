import { ReactEditor } from "slate-react";

/**
 * 
 * @param {ReactEditor} editor 
 */
const withImage = (editor) => {

    const {isVoid} = editor;

    editor.isVoid = (element) => {
        return element.type === "image" ? true : isVoid(element);
    }

    return editor;
}

export default withImage;