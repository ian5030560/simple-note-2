import { Editor } from "slate"
import LinkHelper from "./helper";

/**
 * 
 * @param {Editor} editor 
 */
const withLink = (editor) => {

    const { isInline, insertText } = editor;

    editor.isInline = (value) => value.type === "link" ? true : isInline(value);

    editor.insertText = text => {
        if (text && LinkHelper.isUrl(text)) {
            LinkHelper.toggleLink(editor, text)
        } else {
            insertText(text)
        }
    }

    return editor;
}

export default withLink;