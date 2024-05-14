import { Plugin } from "../index";
import { $getNodeByKey, $isNodeSelection, BaseSelection, LexicalCommand, createCommand } from "lexical";
import CanvasModal from "./modal";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import Corner, { CornerRef } from "../UI/corner";
import ImageNode, { $isImageNode } from "../image/node";
import { Button } from "antd";
import { RiImageEditFill } from "react-icons/ri";

const CanvasPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const ref = useRef<CornerRef>(null);
    const [key, setKey] = useState<string>();

    const handleSelection = useCallback((selection: BaseSelection | null) => {
        if ($isNodeSelection(selection)) {
            let node = selection.getNodes()[0];
            if ($isImageNode(node)) {
                ref.current?.place(node.getKey());
                setKey(node.getKey());
                return;
            }
        }
        ref.current?.leave();
    }, []);

    const handleClick = useCallback(() => {
        if(!key) return;
        editor.update(() => {
            let node = $getNodeByKey(key);
            if($isImageNode(node)){
                let key = node.getKey();
                let {width, height} = editor.getElementByKey(key)!.getBoundingClientRect();
                let image = new Image();
                image.width = width;
                image.height = height;
                image.src = node.getSrc();
                // editor.dispatchCommand(OPEN_CANVAS, ({image, key}));
            }
        })
    }, [editor, key]);

    return <>
        <CanvasModal />
        <Corner nodeType={ImageNode} placement={["top", "right"]} trigger="selected"
            ref={ref} onSeletionChange={handleSelection}>
            <Button type="primary" icon={<RiImageEditFill size={20} />} onClick={handleClick}/>
        </Corner>
    </>
}

export default CanvasPlugin;