import React from "react";

export const H1 = ({children, element}) => {
    return <h1 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h1>
}

export const H2 = ({children, element}) => {
    return <h2 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h2>
}

export const H3 = ({children, element}) => {
    return <h3 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h3>
}

export const H4 = ({children, element}) => {
    return <h4 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h4>
}

export const H5 = ({children, element}) => {
    return <h5 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h5>
}

export const H6 = ({children, element}) => {
    return <h6 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h6>
}