import { useCallback, useEffect } from "react";
import { Plugin } from "../Extension/index";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { createPortal } from "react-dom";
import DraggableElement, { PlusItem, DropLine, useAnchor } from "./component";
import useDnd from "./store";
import { getBlockFromPoint } from "./util";
import useDndHandler, { DRAGGABLE_TAG } from "./handler";

export interface DraggableProp {
    plusList: PlusItem[],
}
const Draggable = ({ plusList }: DraggableProp) => {
    const { setElement, reset, setId, isSelecting } = useDnd();
    const [editor] = useLexicalComposerContext();
    const anchor = useAnchor();
    const { handleDragOver, handleDrop } = useDndHandler();

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if(isSelecting) return;
        
        const { clientX, clientY } = e;
        
        const target = document.elementFromPoint(clientX, clientY);
        const root = editor.getRootElement()!;
        const scroller = document.getElementById("editor-scroller");
        if (root?.isEqualNode(target) || !scroller) return;

        const elem = getBlockFromPoint(editor, clientX, clientY, scroller);
        if (!elem || !elem.hasAttribute(DRAGGABLE_TAG) || !anchor) return;

        const { x, y, height: eh } = elem.getBoundingClientRect();
        const { top, left } = anchor.getBoundingClientRect();
        setId(elem.getAttribute(DRAGGABLE_TAG)!);
        setElement(x - left, y + eh / 2 - top);

    }, [isSelecting, editor, anchor, setId, setElement]);

    const handleMouseLeave = useCallback(() => {
        if(isSelecting) return;
        reset("element");
    }, [isSelecting, reset]);

    useEffect(() => {
        const scroller = document.getElementById("editor-scroller");
        scroller?.addEventListener("mousemove", handleMouseMove);
        scroller?.addEventListener("mouseleave", handleMouseLeave);
        anchor?.addEventListener("dragover", handleDragOver);
        anchor?.addEventListener("drop", handleDrop);
        
        const removeListener = editor.registerUpdateListener(() => {
            const keys = editor.getEditorState().read(() => $getRoot().getChildrenKeys());
            for (const key of keys) {
                const element = editor.getElementByKey(key);
                element?.setAttribute(DRAGGABLE_TAG, key);
            }
        })

        return () => {
            scroller?.removeEventListener("mousemove", handleMouseMove);
            scroller?.removeEventListener("mouseleave", handleMouseLeave);
            anchor?.removeEventListener("dragover", handleDragOver);
            anchor?.removeEventListener("drop", handleDrop);
            removeListener();
        }
    }, [editor, handleDragOver, handleDrop, handleMouseLeave, handleMouseMove, anchor]);

    return anchor ? createPortal(
        <>
            <DraggableElement plusList={plusList} />
            <DropLine />
        </>,
        anchor
    ) : null;
}

const DraggablePlugin: Plugin<DraggableProp> = (prop) => <Draggable {...prop} />;
export default DraggablePlugin;