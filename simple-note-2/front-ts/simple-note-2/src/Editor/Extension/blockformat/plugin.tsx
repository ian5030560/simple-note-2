import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from ".."
import { useCallback, useEffect, useRef, useState } from "react";
import { $getSelection, $isNodeSelection, SELECTION_CHANGE_COMMAND, ElementFormatType, $getNodeByKey } from "lexical";
import { $isDecoratorBlockNode, DecoratorBlockNode, } from "@lexical/react/LexicalDecoratorBlockNode";
import { useWrapper } from "../../Draggable/component";
import { createPortal } from "react-dom";
import { Button } from "antd";
import { CiTextAlignCenter, CiTextAlignLeft, CiTextAlignRight } from "react-icons/ci";
import styles from "./plugin.module.css";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";

const FORMAT: { [key: string]: React.ReactNode } = {
    "left": <CiTextAlignLeft />,
    "center": <CiTextAlignCenter />,
    "right": <CiTextAlignRight />,
}
const DEFAULT = { top: -10000, left: -10000 }
const BlockFormatPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const [pos, setPos] = useState(DEFAULT);
    const [format, setFormat] = useState<ElementFormatType>("left");
    const [key, setKey] = useState<string>();
    const wrapper = useWrapper();
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        return editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            const selection = $getSelection();
            let key: string | undefined = undefined;
            let format: ElementFormatType = "left";
            let position = DEFAULT;
            if ($isNodeSelection(selection)) {
                let node = selection.getNodes()[0];
                if ($isDecoratorBlockNode(node)) {
                    let { width, x, y } = editor.getElementByKey(node.getKey())!.getBoundingClientRect();
                    let { top, left } = wrapper!.getBoundingClientRect();
                    let { width: offset } = ref.current!.getBoundingClientRect();
                    position = { left: x - left + width - offset, top: y - top };
                    key = node.getKey();
                    format = node.__format;
                }
            }
            setPos(position);
            setKey(key);
            setFormat(format);
            return true;
        }, 4)
    })

    const handleClick = useCallback(() => {
        if(!key) return;

        editor.update(() => {
            let node = $getNodeByKey(key) as DecoratorBlockNode;
            let keys = Object.keys(FORMAT);
            let id = (keys.indexOf(format) + 1) % keys.length;
            setFormat(keys[id] as ElementFormatType);
            node.setFormat(keys[id] as ElementFormatType);
        })
        
    }, [editor, format, key]);

    return wrapper ? createPortal(<Button className={styles.blockFormatButton} ref={ref}
        size="large" style={{ transform: `translate(${pos.left}px, ${pos.top}px)` }}
        icon={!format ? <CiTextAlignLeft /> : FORMAT[format]} onClick={handleClick}/>, wrapper) : null;
}
export default BlockFormatPlugin;