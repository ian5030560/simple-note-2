import React from "react";
import { Popover } from "antd";

const Link = ({children, element}) => {

    const content = <a href={element.link}>{element.link}</a>;

    return <Popover content={content} arrow={false} trigger={"click"}>
        <a href={element.link}>{children}</a>;
    </Popover>
    
}

export default Link;