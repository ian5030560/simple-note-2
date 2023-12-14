import { Editor } from "slate";
import { theme } from "antd";
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
    detectColor(editor){
        const marks = Editor.marks(editor);
        const colorText = rgbToHex(theme.getDesignToken().colorText);

        return marks ? marks.color ? marks.color: colorText : colorText;
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {string} color 
     */
    changeColor(editor, color){
        Editor.addMark(editor, "color", color);
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
        return marks ? marks.bgColor ? marks.bgColor: "#ffffff50" : "#ffffff50";
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {string} color 
     */
    changeColor(editor, color){
        Editor.addMark(editor, "bgColor", color);
    }
}

export {
    ColorHelper,
    BgColorHelper
}