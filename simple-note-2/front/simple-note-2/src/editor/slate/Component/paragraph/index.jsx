import React from "react"
import createElement from "../../spec/element";

const Paragraph = ({ children, element }) => {
   
    return <p style={{ 
        width: "100%",
        textAlign: element.align ? element.align: "start",
    }}>{children}</p>
}


const paragraph = createElement(Paragraph);
export default paragraph;