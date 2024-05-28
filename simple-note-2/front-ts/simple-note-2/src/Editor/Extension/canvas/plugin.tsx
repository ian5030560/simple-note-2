import { Plugin } from "../index";
import { $getNodeByKey, $getRoot, $getSelection, $isNodeSelection, $isRangeSelection, $isRootNode, BaseSelection, COMMAND_PRIORITY_EDITOR, LexicalCommand, createCommand } from "lexical";
import CanvasModal from "./modal";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import Corner, { CornerRef } from "../UI/corner";
import ImageNode, { $isImageNode } from "../image/node";
import { Button } from "antd";
import { RiImageEditFill } from "react-icons/ri";
import { $createCanvasNode } from "./node";
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";

export const INSERT_CANVAS: LexicalCommand<ExcalidrawInitialDataState | undefined | null> = createCommand();
const CanvasPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const ref = useRef<CornerRef>(null);
    const [key, setKey] = useState<string>();

    // const handleSelection = useCallback((selection: BaseSelection | null) => {
    //     if ($isNodeSelection(selection)) {
    //         let node = selection.getNodes()[0];
    //         if ($isImageNode(node)) {
    //             ref.current?.place(node.getKey());
    //             setKey(node.getKey());
    //             return;
    //         }
    //     }
    //     ref.current?.leave();
    // }, []);

    // const handleClick = useCallback(() => {
    //     if(!key) return;
    //     editor.update(() => {
    //         let node = $getNodeByKey(key);
    //         if($isImageNode(node)){
    //             let key = node.getKey();
    //             let {width, height} = editor.getElementByKey(key)!.getBoundingClientRect();
    //             let image = new Image();
    //             image.width = width;
    //             image.height = height;
    //             image.src = node.getSrc();
    //             // editor.dispatchCommand(OPEN_CANVAS, ({image, key}));
    //         }
    //     })
    // }, [editor, key]);

    useEffect(() => {
        editor.registerCommand(INSERT_CANVAS, (payload) => {

            editor.update(() => {
                const selection = $getSelection();
                const node = $createCanvasNode();
                payload && node.setData(payload);
                if ($isRangeSelection(selection)) {
                    if ($isRootNode(selection.anchor.getNode())) {
                        selection.insertParagraph();
                    }
                    selection.insertNodes([node]);
                }
                else {
                    $getRoot().selectEnd().insertNodes([node]);
                }
            });

            return true;
        }, COMMAND_PRIORITY_EDITOR)
    }, [editor]);

    return <>
        <CanvasModal />
        {/* <Corner nodeType={ImageNode} placement={["top", "right"]} trigger="selected"
            ref={ref} onSeletionChange={handleSelection}>
            <Button type="primary" icon={<RiImageEditFill size={20} />} onClick={handleClick}/>
        </Corner> */}
    </>
}

export default CanvasPlugin;