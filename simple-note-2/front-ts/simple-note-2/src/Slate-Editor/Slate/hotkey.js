import { Editor } from "slate";
import isHotkey from "is-hotkey";
import {MarkModB, MarkModI, MarkModU} from "./Component/mark/hotkey";
import {LinkLeft, LinkRight} from "./Component/link/hotkey";
import {ListTab, ListShiftTab} from "./Component/list/hotkey";


const KEYMAP = [
    MarkModB,
    MarkModI,
    MarkModU,
    LinkLeft, 
    LinkRight,
    ListTab, 
    ListShiftTab
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
