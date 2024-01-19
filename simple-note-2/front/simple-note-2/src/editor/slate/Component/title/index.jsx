import React from "react";
import createElement from "../../spec/element";

const H1 = ({children, element}) => {
    return <h1 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h1>
}

const H2 = ({children, element}) => {
    return <h2 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h2>
}

const H3 = ({children, element}) => {
    return <h3 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h3>
}

const H4 = ({children, element}) => {
    return <h4 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h4>
}

const H5 = ({children, element}) => {
    return <h5 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h5>
}

const H6 = ({children, element}) => {
    return <h6 style={{
        width: "100%",
        textAlign: element.align ? element.align : "start"
    }}>{children}</h6>
}

export const h1 = createElement(H1);
export const h2 = createElement(H2);
export const h3 = createElement(H3);
export const h4 = createElement(H4);
export const h5 = createElement(H5);
export const h6 = createElement(H6);