import React from "react";

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

const Title = {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6
}

export default Title