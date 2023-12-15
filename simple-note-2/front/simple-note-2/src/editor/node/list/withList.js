import { Editor, Element, Transforms } from "slate"


const LIST = ["ordered", "unordered"];
/**
 * 
 * @param {Editor} editor 
 */
const withList = (editor) => {

    const {isInline} = editor;

    editor.isInline = (value) =>{
        return value.type === "list-item" ? true: isInline(value);
    } 

    return editor;
}

export default withList