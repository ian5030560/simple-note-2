import React from "react";
import createElement from "../../spec/element";

const Unordered = ({children}) => {
    const style = {
        width: "100%",
    }

    return <ul style={style}><li>{children}</li></ul>
}

const Ordered = ({element, children}) => {
    const style = {
        width: "100%",
    }

    return <ol start={element.index} style={style}><li>{children}</li></ol>
}

export const unordered = createElement(Unordered);
export const ordered = createElement(Ordered);