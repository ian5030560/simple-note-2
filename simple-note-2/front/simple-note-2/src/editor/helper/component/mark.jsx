import React from "react";

const Bold = ({children}) => {
    return <span style={{fontWeight: "bold"}}>{children}</span>
}

const Italic = ({children}) => {
    return <span style={{fontStyle: "italic"}}>{children}</span>
}

const Underline = ({children}) => {
    return <span style={{textDecoration: "underline"}}>{children}</span>
}

const MARK = {
    bold: Bold,
    italic: Italic,
    underline: Underline,
}

export default MARK;