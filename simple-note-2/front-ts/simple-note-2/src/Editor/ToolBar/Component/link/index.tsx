import React from "react";
import { PopupButton } from "../Basic/button";
import { LinkOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";

const Link: React.FC = () => {
    const [editor] = useLexicalComposerContext();

    return <PopupButton
        summitButton={{
            type: "primary",
            children: "嵌入"
        }}
        icon={<LinkOutlined />}
        type="text"
        onSummit={(text) => editor.dispatchCommand(TOGGLE_LINK_COMMAND, text || null)}
    />;
}

export default Link;