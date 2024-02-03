import React from "react"

const Paragraph = ({ children, element }) => {
   
    return <p style={{ 
        width: "100%",
        textAlign: element.align ? element.align: "start",
    }}>{children}</p>
}


export default Paragraph;