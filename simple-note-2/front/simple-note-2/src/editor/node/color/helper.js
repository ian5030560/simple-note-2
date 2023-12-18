import { Editor } from "slate";
import Color from "colorjs.io";

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
        
        return marks ? marks.color ? marks.color: undefined : undefined;
    },

    isActive(editor, color){
        const marks = Editor.marks(editor);
        
        return marks.color === color
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {string} color 
     */
    changeColor(editor, color){
        const isActive = this.isActive(editor, color);

        if(isActive){
            Editor.removeMark(editor, "color");
        }
        else{
            Editor.addMark(editor, "color", color);
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
        return marks ? marks.bgColor ? marks.bgColor: undefined : undefined;
    },

    isActive(editor, color){
        const marks = Editor.marks(editor);
        
        return marks.bgColor === color
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {string} color 
     */
    changeColor(editor, color){
        const isActive = this.isActive(editor, color);

        if(isActive){
            Editor.removeMark(editor, "bgColor");
        }
        else{
            Editor.addMark(editor, "bgColor", color);
        }
    }
}

export {
    ColorHelper,
    BgColorHelper
}