import React from "react";
import MARK from "../helper/component/mark";

const LEAF = {
    ...MARK,
}

const Leaf = ({attributes, children, leaf}) => {
    const attrs = Object.keys(leaf).filter(key => !(key === "id" || key === "text"));
    
    for(let attr of attrs){
        if(leaf[attr]){
            children = LEAF[attr]({children})
        }
    }

    return <span {...attributes}>{children}</span>
}

export default Leaf