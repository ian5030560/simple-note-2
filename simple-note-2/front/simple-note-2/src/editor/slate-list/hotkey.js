import { Editor } from "slate";
import isHotkey from "is-hotkey";
import MarkKeys from "../slate/mark/key";
import LinkKeys from "../slate/link/key";
import ListKeys from "../slate/list/key";


const KEYMAP = [
    ...MarkKeys,
    ...LinkKeys,
    ...ListKeys,
];

/**
 * @param {React.KeyboardEvent<HTMLDivElement>} e
 * @param {Editor} editor  
 */
export default function handleKeyEvent(e, editor){
    for(let key of KEYMAP){
        if(isHotkey(key.key, e)){
            e.preventDefault();
            key.handler(e, editor);
        }
    }
}
