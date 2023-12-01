import $ from "jquery";

/**
 * 
 * @param {bool} dark 
 */
export default function changeEditorStyle(dark){
    const color = dark ? "white" : "black";
    const bg = dark ? "black" : "white";
    $(".cdx-block").css("color", color);
    
    $(".ce-popover").css("backgroundColor", bg);
    $(".ce-popover-item").css("color", color);
    $(".ce-popover-item__icon").css("backgroundColor", bg);

    $(".tc-popover").css("backgroundColor", bg);
    $(".tc-popover__item-icon").css("backgroundColor", bg);
    $(".tc-popover__item-icon").css("color", color);
    
    $(".ce-conversion-toolbar").css("backgroundColor", bg);
    $(".ce-conversion-toolbar").css("color", color);
    $(".ce-conversion-tool__icon").css("backgroundColor", bg);
    $(".ce-conversion-tool__icon").css("color", color);

    $(".ce-inline-toolbar").css("backgroundColor", bg);
    $(".ce-inline-toolbar").css("color", color);

    $(".ce-toolbar__settings-btn").css("color", color);
    $(".ce-toolbar__plus").css("color", color);

    $(".cdx-search-field__input").css("color", color);
}