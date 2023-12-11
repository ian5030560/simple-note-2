import { Editor, Element, Transforms } from "slate"


const LIST = ["ordered", "unordered"];
/**
 * 
 * @param {Editor} editor 
 */
const withList = (editor) => {

    const {insertBreak} = editor;
    
    editor.insertBreak = () => {
        return insertBreak();
    }

    const isList = () => {
        const match = Array.from(editor.nodes(
            {
                match: n => Element.isElement(n)
            }
        ));

        return LIST.includes(match[0][0].type);
    };

    return editor;
}

export default withList