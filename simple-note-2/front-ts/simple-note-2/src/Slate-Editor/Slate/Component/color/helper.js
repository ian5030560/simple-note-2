import { Editor } from "slate";
import Color from "colorjs.io";
import { BGCOLOR, FONTCOLOR } from ".";

export function rgbToHex(rgb) {
    
    let color = new Color(rgb);
    return color.toString({format: "hex"});
}

const ColorHelper = {

    /**
     * 
     * @param {Editor} editor 
     * @returns {string}
     */
    detectColor(editor) {
        
        const marks = Editor.marks(editor); 
        
        return marks ? marks[FONTCOLOR] ? marks[FONTCOLOR]: undefined : undefined;
    },

    isActive(editor, color){
        const marks = Editor.marks(editor);
        
        return marks[FONTCOLOR] === color
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {string} color 
     */
    changeColor(editor, color){
        const isActive = this.isActive(editor, color);

        if(isActive){
            Editor.removeMark(editor, FONTCOLOR);
        }
        else{
            Editor.addMark(editor, FONTCOLOR, color);
        }
        
    }
}

const BgColorHelper = {

    /**
     * 
     * @param {Editor} editor 
     * @returns {string}
     */
    detectColor(editor){
        const marks = Editor.marks(editor);
        return marks ? marks[BGCOLOR] ? marks[BGCOLOR]: undefined : undefined;
    },

    isActive(editor, color){
        const marks = Editor.marks(editor);
        
        return marks[BGCOLOR] === color
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {string} color 
     */
    changeColor(editor, color){
        const isActive = this.isActive(editor, color);

        if(isActive){
            Editor.removeMark(editor, BGCOLOR);
        }
        else{
            Editor.addMark(editor, BGCOLOR, color);
        }
    }
}

export {
    ColorHelper,
    BgColorHelper
}