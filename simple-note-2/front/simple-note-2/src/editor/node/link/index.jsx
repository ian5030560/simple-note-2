import React from "react";

const Link = ({children, element}) => {
    return <a href={element.link}>{children}</a>;
}

export default Link;