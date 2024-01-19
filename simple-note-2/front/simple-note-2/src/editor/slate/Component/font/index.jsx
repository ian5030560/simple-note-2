import React from "react";
import createLeaf from "../../spec/leaf";


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

export const family = createLeaf(FontFamily);
export const size = createLeaf(FontSize);