import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {Button} from "antd";
import { LinkOutlined } from "@ant-design/icons";

const Link: React.FC = () => {
    const [editor] = useLexicalComposerContext();

    return <Button type = "text" icon={<LinkOutlined />} onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://")}/>
}

export default Link;