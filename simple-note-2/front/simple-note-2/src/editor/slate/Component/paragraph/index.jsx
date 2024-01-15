import React from "react"

const Paragraph = ({ children, element }) => {

    return <p style={{ 
        width: "100%",
        textAlign: element.align ? element.align: "start",
    }}>{children}</p>
}

export const NextLine = ({children}) => {
    return <><br/>{children}</>
}

export default Paragraph;