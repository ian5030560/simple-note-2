import { Editor } from "slate";
import isHotkey from "is-hotkey";
import MarkKeys from "./node/mark/key";
import LinkKey from "./node/link/key";


const KEYMAP = [
    ...MarkKeys,
    ...LinkKey,
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
