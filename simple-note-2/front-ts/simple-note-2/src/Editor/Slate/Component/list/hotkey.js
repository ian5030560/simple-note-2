import NoteEditor from "../../NoteEditor";
import { Editor } from "slate";
import ListHelper from "./helper";
import createHotKey from "../../spec/hotkey";

export const ListTab = createHotKey(
    "tab",
    /**
     * 
     * @param {*} e 
     * @param {Editor} editor 
     */
    (_, editor) => {

        const prev = NoteEditor.previousElement(editor, editor.selection);
        const LIST = ["ordered", "unordered"];
        ListHelper.sorted(
            !LIST.includes(prev.type),
            prev.index,
            editor,
            prev.type
        );
    },
);

export const ListShiftTab = createHotKey(
   "shift+tab",
    (_, editor) => {
        ListHelper.sorted(
            true,
            undefined,
            editor,
            undefined
        )
    }
)