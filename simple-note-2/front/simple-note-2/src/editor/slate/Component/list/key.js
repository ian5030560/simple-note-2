import NoteEditor from "../../NoteEditor";
import { Editor } from "slate";
import ListHelper from "./helper";

const ListKeys = [
    {
        key: "tab",
        /**
         * 
         * @param {*} e 
         * @param {Editor} editor 
         */
        handler: (_, editor) => {

            const prev = NoteEditor.previousElement(editor, editor.selection);
            const LIST = ["ordered", "unordered"];
            ListHelper.sorted(
                !LIST.includes(prev.type),
                prev.index,
                editor,
                prev.type
            );
        },
    },
    {
        key: "shift+tab",
        handler: (_, editor) => {
            ListHelper.sorted(
                true,
                undefined,
                editor,
                undefined
            )
        }
    }
]

export default ListKeys;