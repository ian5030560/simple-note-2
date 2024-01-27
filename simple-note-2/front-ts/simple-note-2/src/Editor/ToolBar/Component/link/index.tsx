import React from "react";
import { PopupButton } from "../Basic/button";
import { LinkOutlined } from "@ant-design/icons";

const Link: React.FC = () => {
    return <PopupButton
        summitButton={{
            type: "primary",
            children: "嵌入"
        }}

        icon={<LinkOutlined/>}
        type="text"
    />; 
}

export default Link;