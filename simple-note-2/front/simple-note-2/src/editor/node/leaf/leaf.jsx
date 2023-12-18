import React from "react";

const Leaf = ({attributes, children, leaf, LEAF}) => {
    const attrs = Object.keys(leaf).filter(key => !(key === "id" || key === "text" || key === "highlight"));
    
    for(let attr of attrs){
        if(leaf[attr]){
            children = LEAF[attr]({leaf, children})
        }
    }

    return <span {...attributes} style={{
        backgroundColor: leaf.highlight ? "rgba(255, 0, 0, 0.3)": "initial"
    }}>{children}</span>
}

export default Leaf