import { useCallback, useEffect, useRef } from "react";
import { Plugin } from "../Extension/index";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { createPortal } from "react-dom";
import DraggableElement, { AddItem, DropLine, useWrapper } from "./component";
import { useDndAction } from "./store";
import { getBlockFromPoint } from "./util";
import useDnd, { DRAGGABLE_TAG } from "./dnd";

export interface DraggableProp {
    addList: AddItem[],
}
const Draggable: React.FC<DraggableProp> = ({ addList }) => {
    const { setElement, reset, setId } = useDndAction();
    const [editor] = useLexicalComposerContext();
    const wrapper = useWrapper();
    const ref = useRef<HTMLElement>(null);
    const { handleDragOver, handleDragStart, handleDrop } = useDnd();

    const handleMouseMove = useCallback((e: MouseEvent) => {
        let { clientX, clientY } = e;
        let target = document.elementFromPoint(clientX, clientY);
        let root = editor.getRootElement()!;

        if (root?.isEqualNode(target)) return;

        let elem = getBlockFromPoint(editor, clientX, clientY);

        if (!elem || !elem.hasAttribute(DRAGGABLE_TAG) || !wrapper || !ref.current) return;

        let { x, y, height: eh } = elem.getBoundingClientRect();
        let { top, left } = wrapper.getBoundingClientRect();
        let { width, height: wh } = ref.current.getBoundingClientRect();
        setId(elem.getAttribute(DRAGGABLE_TAG)!);
        setElement(x - left - width, y + (eh - wh) / 2 - top);
    }, [editor, setElement, setId, wrapper]);

    const handleMouseLeave = useCallback(() => reset("element"), [reset]);

    useEffect(() => {
        wrapper?.addEventListener("mousemove", handleMouseMove);
        wrapper?.addEventListener("mouseleave", handleMouseLeave);
        wrapper?.addEventListener("dragover", handleDragOver);
        wrapper?.addEventListener("drop", handleDrop);

        function handleDragEnd() {
            reset('line');
        }
        let element = ref.current;
        element?.addEventListener("dragstart", handleDragStart);
        element?.addEventListener("dragend", handleDragEnd);

        let removeListener = editor.registerUpdateListener(() => {
            const keys = editor.getEditorState().read(() => $getRoot().getChildrenKeys());
            for (let key of keys) {
                let element = editor.getElementByKey(key);
                element?.setAttribute(DRAGGABLE_TAG, key);
            }
        })

        return () => {
            wrapper?.removeEventListener("mousemove", handleMouseMove);
            wrapper?.removeEventListener("mouseleave", handleMouseLeave);
            wrapper?.removeEventListener("dragover", handleDragOver);
            wrapper?.removeEventListener("drop", handleDrop);
            element?.removeEventListener("dragstart", handleDragStart);
            element?.removeEventListener("dragend", handleDragEnd);
            removeListener();
        }
    }, [editor, handleDragOver, handleDragStart, handleDrop, handleMouseLeave, handleMouseMove, reset, wrapper]);

    return wrapper ? createPortal(
        <>
            <DraggableElement addList={addList} ref={ref} />
            <DropLine />
        </>,
        wrapper
    ) : null;
}

export const DraggablePlugin: Plugin<DraggableProp> = (prop) => <Draggable {...prop} />;
export default DraggablePlugin;