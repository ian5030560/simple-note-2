import { useCallback, useEffect } from "react";
import { Plugin } from "../Extension/index";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { createPortal } from "react-dom";
import DraggableElement, { AddItem, DndProvider, DropLine, useWrapper } from "./component";
import { useDrop, useDragOver, useDragStart } from "./dnd";
import { moveElement, resetElement, resetLine, useDndDispatch, setId } from "./redux";
import { theme } from "antd";
import { getBlockFromPoint } from "./util";
import { useScroller } from "../Extension/basic/richtext/scroller";

export interface DraggableProp {
    addList: AddItem[],
}
const Draggable: React.FC<DraggableProp> = ({ addList }) => {
    const dispatch = useDndDispatch();
    const [editor] = useLexicalComposerContext();
    const wrapper = useWrapper();
    const scroller = useScroller();
    const { token } = theme.useToken();
    const handleDragStart = useDragStart();
    const handleDragOver = useDragOver();
    const handleDrop = useDrop();

    const handleMouseMove = useCallback((e: MouseEvent) => {
        let { clientX, clientY } = e;
        let target = document.elementFromPoint(clientX, clientY);
        let root = editor.getRootElement()!;

        if (root?.isEqualNode(target)) return;
        
        let elem = getBlockFromPoint(editor, clientX, clientY);
        if (!elem) return;

        let top = elem.offsetTop;
        let left = elem.offsetLeft;
        dispatch(moveElement({ top: top, left: left - 50 }));
        dispatch(setId(elem.getAttribute("draggable-item")!));

    }, [dispatch, editor]);

    const handleMouseLeave = useCallback(() => {
        dispatch(resetElement())
    }, [dispatch]);

    useEffect(() => {
        scroller?.addEventListener("mousemove", handleMouseMove);
        scroller?.addEventListener("mouseleave", handleMouseLeave);
        wrapper?.addEventListener("dragover", handleDragOver);
        wrapper?.addEventListener("drop", handleDrop);

        return () => {
            scroller?.removeEventListener("mousemove", handleMouseMove);
            scroller?.removeEventListener("mouseleave", handleMouseLeave);
            wrapper?.removeEventListener('dragover', handleDragOver);
            wrapper?.removeEventListener('drop', handleDrop);

            editor.registerUpdateListener(() => {
                const keys = editor.getEditorState().read(() => $getRoot().getChildrenKeys());
                for (let key of keys) {
                    let element = editor.getElementByKey(key);
                    element?.setAttribute("draggable-item", key);
                }
            });
        }
    }, [editor, handleDragOver, handleDrop, handleMouseLeave, handleMouseMove, scroller, wrapper]);

    return wrapper ? createPortal(
        <>
            <DraggableElement
                onDragStart={handleDragStart}
                onDragEnd={() => dispatch(resetLine())}
                addList={addList}
            />
            <DropLine/>
        </>,
        wrapper
    ) : null;
}

export const DraggablePlugin: Plugin<DraggableProp> = (prop) => <DndProvider><Draggable {...prop} /></DndProvider>;
export default DraggablePlugin;