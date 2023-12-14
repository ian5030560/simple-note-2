import React from "react";

const Leaf = ({attributes, children, leaf, LEAF}) => {
    const attrs = Object.keys(leaf).filter(key => !(key === "id" || key === "text"));
    
    for(let attr of attrs){
        if(leaf[attr]){
            children = LEAF[attr]({leaf, children})
        }
    }

    return <span {...attributes}>{children}</span>
}

export default Leaf