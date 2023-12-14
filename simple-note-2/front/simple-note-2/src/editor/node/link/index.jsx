import React from "react";

const Link = ({children, leaf}) => {
    return <span><a href={leaf.link}>{children}</a></span>
}

const LINK = {
    link: Link
}

export default LINK;