import { Editor, Transforms } from "slate";
import React from "react";
import isHotkey from "is-hotkey";


const isNext = isHotkey("shift+enter");
/**
 * @param {React.KeyboardEvent<HTMLDivElement>} e
 * @param {Editor} editor  
 */
export default function handleKeyEvent(e, editor){
    if(!e.shiftKey) return;
    if(e.shiftKey && e.key === "Enter") nextLine(editor); e.preventDefault();
}

/**
 * 
 * @param {Editor} editor 
 */
function nextLine(editor) {
    Transforms.insertText(editor, "\n");
}