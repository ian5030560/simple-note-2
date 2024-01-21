import React from "react";

export const Unordered = ({children}) => {
    const style = {
        width: "100%",
    }

    return <ul style={style}><li>{children}</li></ul>
}

export const Ordered = ({element, children}) => {
    const style = {
        width: "100%",
    }

    return <ol start={element.index} style={style}><li>{children}</li></ol>
}