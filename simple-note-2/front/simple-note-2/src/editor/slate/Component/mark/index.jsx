import React from "react";
import createLeaf from "../../spec/leaf";

const Bold = ({children}) => {
    return <span style={{fontWeight: "bold"}}>{children}</span>
}

const Italic = ({children}) => {
    return <span style={{fontStyle: "italic"}}>{children}</span>
}

const Underline = ({children}) => {
    return <span style={{textDecoration: "underline"}}>{children}</span>
}

export const bold = createLeaf(Bold);
export const italic = createLeaf(Italic);
export const underline = createLeaf(Underline);