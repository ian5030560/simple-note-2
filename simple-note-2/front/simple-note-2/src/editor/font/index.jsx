import React from "react";


const FontFamily = ({leaf, children}) => {
    return <span style={{
        fontFamily: leaf.family && leaf.family !== "default" ? leaf.family : "initial",
    }}>{children}</span>
}

const FontSize = ({leaf, children}) => {
    return <span style={{
        fontSize: leaf.size ? `${leaf.size}px`: "initial"
    }}>{children}</span>
}

const FONT = {
    family: FontFamily,
    size: FontSize
}

export default FONT;