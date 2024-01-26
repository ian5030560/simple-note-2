import React from "react";

export const FONTFAMILY = "font-family";
export const FONTSIZE = "font-size";

export const FontFamily = ({leaf, children}) => {
    
    return <span style={{
        fontFamily: leaf[FONTFAMILY] && leaf[FONTFAMILY] !== undefined ? leaf[FONTFAMILY] : undefined,
    }}>{children}</span>
}

export const FontSize = ({leaf, children}) => {
    return <span style={{
        fontSize: leaf[FONTSIZE] ? `${leaf[FONTSIZE]}px`: undefined
    }}>{children}</span>
}