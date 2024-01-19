import React from "react";
import { Popover } from "antd";
import createElement from "../../spec/element";

const Link = ({children, element}) => {

    const content = <a href={element.link}>{element.link}</a>;

    return <Popover content={content} arrow={false} trigger={"click"}>
        <a href={element.link}>{children}</a>;
    </Popover>
    
}

const link = createElement(Link, true);
export default link;