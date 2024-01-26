import React from "react"

export const FONTCOLOR = "font-color";
export const BGCOLOR = "background-color";

export const FontColor = ({leaf, children}) => {
    return <span style={{color: leaf[FONTCOLOR] ? leaf[FONTCOLOR]: "black"}}>{children}</span>
}

export const BackgroundColor = ({leaf, children}) => {
    return <span style={{backgroundColor: leaf[BGCOLOR] ? leaf[BGCOLOR]: "transparent"}}>{children}</span>
}