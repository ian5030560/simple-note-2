import { useCallback, useEffect, useState } from "react";
import { ToolKitButton } from "./ui";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_CRITICAL } from "lexical";
import styles from "./aiPlaceholder.module.css";
import { ON_FINISH_PLACEHOLDER, ON_SEND_PLACEHOLDER, SET_PLACEHOLDER } from "../AIPlugins/placeholder";
import {mergeRegister} from "@lexical/utils";

export default function AIPlaceholder() {
    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();
    const [thinking, setThinking] = useState(false);

    useEffect(() => mergeRegister(
        editor.registerCommand(ON_SEND_PLACEHOLDER, () => {
            setThinking(true);
            return false;
        }, COMMAND_PRIORITY_CRITICAL),
        editor.registerCommand(ON_FINISH_PLACEHOLDER, () => {
            setThinking(false);
            return false;
        }, COMMAND_PRIORITY_CRITICAL)
    ), [editor]);

    const handleClick = useCallback(() => {
        setOpen(prev => {
            editor.dispatchCommand(SET_PLACEHOLDER, !prev);
            return !prev;
        })
    }, [editor]);

    return <ToolKitButton shape="circle" icon={open ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        onClick={handleClick} className={thinking ? styles.circleWave : undefined}/>
}