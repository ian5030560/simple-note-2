import $ from "jquery";

/**
 * 
 * @param {bool} dark 
 */
export default function changeEditorStyle(dark){
    const color = dark ? "white" : "black";
    $(".cdx-block").css("color", color);
}