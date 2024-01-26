import React from "react";

export const Unordered = ({ children }) => {
    const style = {
        width: "100%",
    }

    return <ul style={style}><li>{children}</li></ul>
}

export const Ordered = ({ element, children }) => {
    const style = {
        width: "100%",
    }

    return <ol start={element.index} style={style}><li>{children}</li></ol>
}

// const item = ({ children }) => {
//     return <li>{children}</li>
// }

// export const ListItem = ({ children, element }) => {

//     const create = useCallback((ch) => {
//         let { indent } = element.indent;
//         while (indent) {
//             ch = item({ ch })
//             indent --;
//         }

//         return ch
//     }, [element.indent]);

//     return <li>{create(children)}</li>
// }