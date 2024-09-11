import { useCallback } from "react";
import useDnd from "./store";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { getBlockFromPoint } from "./util";
import { eventFiles } from "@lexical/rich-text";

export const HEIGHT = 5;
export const DRAGGABLE_TAG = "draggable-item";
const useDndHandler = () => {
    const [editor] = useLexicalComposerContext();
    const {setLine, id, line, dragging}  = useDnd();

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();

        if (!e.dataTransfer || eventFiles(e)[0] || !dragging) return false;
        let { clientY: mouseY } = e;

        let overElement = getBlockFromPoint(editor, e.clientX, e.clientY);

        if (!overElement || !overElement.hasAttribute(DRAGGABLE_TAG)) return false;

        let { x, y, width, height } = overElement.getBoundingClientRect();
        const { top, left } = document.getElementById("dnd-anchor")!.getBoundingClientRect();

        const { marginTop, marginBottom } = window.getComputedStyle(overElement);
        
        let overHalf = mouseY > (y + height / 2);
        if (!overHalf) {
            let previous = overElement.previousElementSibling;
            
            if (!previous) {
                y -= HEIGHT;
            }
            else {
                const { marginBottom: pMarginBottom } = window.getComputedStyle(previous);
                let offset = Math.max(parseFloat(pMarginBottom), parseFloat(marginTop)) / 2;
                y -= offset;
            }
        }
        else {
            let next = overElement.nextElementSibling;
            y += height;
            if (!next) {
                y += HEIGHT;
            }
            else {
                const { marginTop: nMarginTop } = window.getComputedStyle(next);
                let offset = Math.max(parseFloat(nMarginTop), parseFloat(marginBottom)) / 2;
                y += offset;
            }
        }

        x -= left;
        y -= top;

        setLine({ x: x, y: y, width: width, height: HEIGHT });
        return true;
    }, [dragging, editor, setLine]);

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        
        if (!e.dataTransfer || eventFiles(e)[0] || !dragging) return false;

        let dropElement = getBlockFromPoint(editor, e.clientX, e.clientY);

        if (!dropElement || !dropElement.hasAttribute(DRAGGABLE_TAG)) return false;

        editor.update(() => {
            let dropKey = dropElement!.getAttribute(DRAGGABLE_TAG);
            let dragKey = id;

            if (!dragKey || !dropKey) return false;

            const dropNode = $getNodeByKey(dropKey);
            const dragNode = $getNodeByKey(dragKey);

            if (!dragNode || !dropNode || dragKey === dropKey) return;

            const mouseAt = line!.y! + document.getElementById("dnd-anchor")!.getBoundingClientRect().top;

            const { top, height } = dropElement!.getBoundingClientRect();
            const half = top + height / 2;

            if (mouseAt < half) {
                dropNode.insertBefore(dragNode);
            }
            else {
                dropNode.insertAfter(dragNode);
            }
        })

        return true;
    }, [dragging, editor, id, line]);

    return { handleDragOver, handleDrop }
}

export default useDndHandler;