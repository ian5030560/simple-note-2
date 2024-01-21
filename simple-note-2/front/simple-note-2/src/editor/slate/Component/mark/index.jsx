import React from "react";

export const Bold = ({children}) => {
    return <span style={{fontWeight: "bold"}}>{children}</span>
}

export const Italic = ({children}) => {
    return <span style={{fontStyle: "italic"}}>{children}</span>
}

export const Underline = ({children}) => {
    return <span style={{textDecoration: "underline"}}>{children}</span>
}