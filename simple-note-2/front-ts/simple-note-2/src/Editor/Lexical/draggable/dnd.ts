import { useCallback } from "react";
import { moveLine, resetLine, setId, useDndDispatch, useDndSelector } from "./redux";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { getBlockFromPoint } from "./util";
import {eventFiles} from "@lexical/rich-text";

type NativeDndHandler = (...args: any[]) => (e: DragEvent) => any;
type ReactDndHanlder = (...args: any[]) => React.DragEventHandler<HTMLElement>;
type HandleType = "native" | "react";
type DndHanlder<T extends HandleType> = T extends "native" ? NativeDndHandler : ReactDndHanlder;

export const useDragStart: DndHanlder<"react"> = () => {
    const [editor] = useLexicalComposerContext();
    const id = useDndSelector(state => state.dnd.dragId);

    const handleDragStart = useCallback((e: React.DragEvent) => {

        if(eventFiles(e.nativeEvent)[0]) return false;

        if (!e.dataTransfer || !id) return false;
        const element = editor.getElementByKey(id);
        e.dataTransfer.setDragImage(element!, 0, 0);

    }, [editor, id]);

    return handleDragStart;
}


export const useDragOver: DndHanlder<"native"> = () => {
    const dispatch = useDndDispatch();
    const [editor] = useLexicalComposerContext();

    const handleDragOver = useCallback((e: DragEvent): boolean => {
        e.preventDefault();

        if(eventFiles(e)[0]) return false;
        
        let { target: overElement, clientY: mouseY } = e as {target: HTMLElement | null, clientY: number};

        if (!overElement?.hasAttribute("draggable-item")) overElement = getBlockFromPoint(editor, e.clientX, e.clientY);
        if (!overElement) return false;

        const { top: overTop } = overElement.getBoundingClientRect();
        const { marginTop, marginBottom, height } = window.getComputedStyle(overElement);
        // const parentRect = overElement.parentElement!.getBoundingClientRect();

        let overHalf = mouseY > (overTop + parseFloat(height) / 2);
        
        let top = overElement.offsetTop;
        top = !overHalf ? top - parseFloat(marginTop) / 2 :
            top + parseFloat(height) + parseFloat(marginBottom) / 2;

        let left = overElement.offsetLeft!

        dispatch(moveLine({ top: top, left: left }));

        return true;
    }, [dispatch, editor]);

    return handleDragOver;
}

export const useDrop: DndHanlder<"native"> = () => {
    const [editor] = useLexicalComposerContext();
    const line = useDndSelector(state => state.dnd.line);
    const id = useDndSelector(state => state.dnd.dragId);
    const dispatch = useDndDispatch();

    const handleDrop = useCallback((e: DragEvent) => {

        if(eventFiles(e)[0]) return false;

        let dropElement = e.target as HTMLElement | null;
        if (!dropElement?.hasAttribute("draggable-item")) dropElement = getBlockFromPoint(editor, e.clientX, e.clientY);
        if(!dropElement) return false;

        editor.update(() => {
            let dropKey = dropElement!.getAttribute("draggable-item");
            let dragKey = id;

            if (!dragKey || !dropKey) return false;

            const dropNode = $getNodeByKey(dropKey);
            const dragNode = $getNodeByKey(dragKey);

            if (!dragNode || !dropNode || dragKey === dropKey) return;

            const mouseAt = line.top + dropElement!.parentElement!.getBoundingClientRect().top;

            const dropRect = dropElement!.getBoundingClientRect();
            const half = dropRect.top + dropRect.height / 2;

            if (mouseAt < half) {
                dropNode.insertBefore(dragNode);
            }
            else {
                dropNode.insertAfter(dragNode);
            }

            dispatch(setId(undefined));
            dispatch(resetLine());
        })

        return true;
    }, [dispatch, editor, id, line.top]);

    return handleDrop
}