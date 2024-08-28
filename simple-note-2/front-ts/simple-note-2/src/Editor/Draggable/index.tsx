import { useCallback, useEffect, useMemo, useRef } from "react";
import { Plugin } from "../Extension/index";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { createPortal } from "react-dom";
import DraggableElement, { PlusItem, DropLine, useWrapper } from "./component";
import { useDndAction } from "./store";
import { getBlockFromPoint } from "./util";
import useDnd, { DRAGGABLE_TAG } from "./dnd";

export interface DraggableProp {
    plusList: PlusItem[],
}
const Draggable: React.FC<DraggableProp> = ({ plusList }) => {
    const { setElement, reset, setId } = useDndAction();
    const [editor] = useLexicalComposerContext();
    const wrapper = useWrapper();
    const scroller = useMemo(() => document.getElementById("editor-scroller"), []);
    const { handleDragOver, handleDrop } = useDnd();

    const handleMouseMove = useCallback((e: MouseEvent) => {
        let { clientX, clientY } = e;
        let target = document.elementFromPoint(clientX, clientY);
        let root = editor.getRootElement()!;
        if (root?.isEqualNode(target) || !scroller) return;

        let elem = getBlockFromPoint(editor, clientX, clientY, scroller);
        if (!elem || !elem.hasAttribute(DRAGGABLE_TAG) || !wrapper) return;

        let { x, y, height: eh } = elem.getBoundingClientRect();
        let { top, left } = wrapper.getBoundingClientRect();
        setId(elem.getAttribute(DRAGGABLE_TAG)!);
        setElement(x - left, y + eh / 2 - top);

    }, [editor, scroller, setElement, setId, wrapper]);

    const handleMouseLeave = useCallback(() => reset("element"), [reset]);

    useEffect(() => {
        scroller?.addEventListener("mousemove", handleMouseMove);
        scroller?.addEventListener("mouseleave", handleMouseLeave);
        wrapper?.addEventListener("dragover", handleDragOver);
        wrapper?.addEventListener("drop", handleDrop);
        
        let removeListener = editor.registerUpdateListener(() => {
            const keys = editor.getEditorState().read(() => $getRoot().getChildrenKeys());
            for (let key of keys) {
                let element = editor.getElementByKey(key);
                element?.setAttribute(DRAGGABLE_TAG, key);
            }
        })

        return () => {
            scroller?.removeEventListener("mousemove", handleMouseMove);
            scroller?.removeEventListener("mouseleave", handleMouseLeave);
            wrapper?.removeEventListener("dragover", handleDragOver);
            wrapper?.removeEventListener("drop", handleDrop);
            removeListener();
        }
    }, [editor, handleDragOver, handleDrop, handleMouseLeave, handleMouseMove, scroller, wrapper]);

    return wrapper ? createPortal(
        <>
            <DraggableElement plusList={plusList} />
            <DropLine />
        </>,
        wrapper
    ) : null;
}

export const DraggablePlugin: Plugin<DraggableProp> = (prop) => <Draggable {...prop} />;
export default DraggablePlugin;