import { useCallback, useEffect, useState } from "react";
import { ToolKitButton } from "./ui";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SEND_SERVER_AT_AIPLACEHOLDER, SET_AIPLACEHOLDER } from "../AIPlugins/command";
import { COMMAND_PRIORITY_CRITICAL } from "lexical";

export default function AIPlaceholder() {
    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();
    const [thinking, setThinking] = useState(false);

    useEffect(() => editor.registerCommand(SEND_SERVER_AT_AIPLACEHOLDER, () => {
        
        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

    const handleClick = useCallback(() => {
        setOpen(prev => {
            editor.dispatchCommand(SET_AIPLACEHOLDER, !prev);
            return !prev;
        })
    }, [editor]);

    return <ToolKitButton icon={open ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        onClick={handleClick} />
}