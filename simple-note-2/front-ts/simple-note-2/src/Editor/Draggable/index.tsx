import { useCallback, useEffect, useRef } from "react";
import { Plugin } from "../Extension/index";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, DRAGOVER_COMMAND, DROP_COMMAND } from "lexical";
import { createPortal } from "react-dom";
import DraggableElement, { AddItem, DropLine, useWrapper } from "./component";
import { useDndAction, DndProvider } from "./redux";
import { getBlockFromPoint } from "./util";
import { mergeRegister } from "@lexical/utils";
import useDnd, { DRAGGABLE_TAG } from "./dnd";

export interface DraggableProp {
    addList: AddItem[],
}
const Draggable: React.FC<DraggableProp> = ({ addList }) => {
    const action = useDndAction();
    const [editor] = useLexicalComposerContext();
    const wrapper = useWrapper();
    const ref = useRef<HTMLElement>(null);
    const {handleDragOver, handleDragStart, handleDrop} = useDnd();

    const handleMouseMove = useCallback((e: MouseEvent) => {
        let { clientX, clientY } = e;
        let target = document.elementFromPoint(clientX, clientY);
        let root = editor.getRootElement()!;

        if (root?.isEqualNode(target)) return;

        let elem = getBlockFromPoint(editor, clientX, clientY);
        if (!elem || !elem.hasAttribute(DRAGGABLE_TAG) || !wrapper || !ref.current) return;

        let { x, y } = elem.getBoundingClientRect();
        let { top, left } = wrapper.getBoundingClientRect();
        let { width } = ref.current.getBoundingClientRect();
        action.setId(elem.getAttribute(DRAGGABLE_TAG)!);
        action.moveElement(x - left - width, y - top);

    }, [action, editor, wrapper]);

    const handleMouseLeave = useCallback(() => {
        action.resetElement();
    }, [action]);

    useEffect(() => {
        wrapper?.addEventListener("mousemove", handleMouseMove);
        wrapper?.addEventListener("mouseleave", handleMouseLeave);

        function handleDragEnd(){
            action.resetLine();
        }
        let element = ref.current;
        element?.addEventListener("dragstart", handleDragStart);
        element?.addEventListener("dragend", handleDragEnd);

        let removeListener = mergeRegister(
            editor.registerUpdateListener(() => {
                const keys = editor.getEditorState().read(() => $getRoot().getChildrenKeys());
                for (let key of keys) {
                    let element = editor.getElementByKey(key);
                    element?.setAttribute(DRAGGABLE_TAG, key);
                }
            }),
            editor.registerCommand(DRAGOVER_COMMAND, handleDragOver, 1),
            editor.registerCommand(DROP_COMMAND, handleDrop, 4),
        )
        return () => {
            wrapper?.removeEventListener("mousemove", handleMouseMove);
            wrapper?.removeEventListener("mouseleave", handleMouseLeave);
            element?.removeEventListener("dragstart", handleDragStart);
            element?.removeEventListener("dragend", handleDragEnd);
            removeListener();
        }
    }, [action, editor, handleDragOver, handleDragStart, handleDrop, handleMouseLeave, handleMouseMove, wrapper]);

    return wrapper ? createPortal(
        <>
            <DraggableElement
                addList={addList}
                ref={ref}
            />
            <DropLine />
        </>,
        wrapper
    ) : null;
}

export const DraggablePlugin: Plugin<DraggableProp> = (prop) => <DndProvider><Draggable {...prop} /></DndProvider>;
export default DraggablePlugin;