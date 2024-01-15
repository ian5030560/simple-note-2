import NoteEditor from "../../NoteEditor";
import { Editor, TextUnit, Transforms } from "slate";
/**
 * 
 * @param {Editor} editor 
 */
const withList = (editor) => {

    const { onChange, deleteBackward } = editor;
    const LIST = ["ordered", "unordered"];

    editor.onChange = (op) => {
        if(!op) return onChange(op);

        const { operation } = op;

        if(!operation) return onChange(op);

        if (operation.type === "split_node") {
            const prevElement = NoteEditor.previousElement(editor, editor.selection);
            if (LIST.includes(prevElement.type)) {
                editor.setNodes({ type: prevElement.type, index: prevElement.type === "ordered" && prevElement.index + 1 })
            }
        }
        else if (operation.type === "move_node") {
            console.log(operation);
        }

        return onChange(op);
    }

    /**
     * 
     * @param {TextUnit} unit 
     */
    editor.deleteBackward = (unit) => {
        const element = NoteEditor.element(editor, editor.selection);

        if (LIST.includes(element.type) &&
            element.children.length === 1 &&
            !element.children[0].text
        ) {
            return Transforms.setNodes(editor, {type: "paragraph", index: undefined});
        }
    
        return deleteBackward(unit);
    }


    
    return editor;
}

export default withList