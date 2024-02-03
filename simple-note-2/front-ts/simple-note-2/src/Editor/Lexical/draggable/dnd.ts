import { useCallback } from "react";

type NativeDndHandler = (...args: any[]) => (e: DragEvent) => any;
type ReactDndHanlder = (...args: any[]) => React.DragEventHandler<HTMLElement>;
type HandleType = "native" | "react";
type DndHanlder<T extends HandleType> = T extends "native" ? NativeDndHandler : ReactDndHanlder;

export const useDragStart: DndHanlder<"react"> = (draggableElement: HTMLElement) => {
    const handleDragStart = useCallback((e: React.DragEvent) => {
        if (!e.dataTransfer || !draggableElement) return;
        e.dataTransfer.setDragImage(draggableElement, 0, 0);
    }, [draggableElement]);

    return handleDragStart;
}

export const useDragOver: DndHanlder<"native"> = (dropLine: HTMLDivElement) => {

    const handleDragOver = useCallback((e: DragEvent): boolean => {
        e.preventDefault();
        const overElement = e.target as HTMLElement;
        const overRect = overElement.getBoundingClientRect();

        if(!dropLine) return false;
        
        const mouseAt = e.clientY;
        const half = overRect.y + overRect.height;

        if (mouseAt < half) {
            dropLine.classList.add("drop-line-top");
        }
        else {
            dropLine.classList.add("drop-line-bottom");
        }

        return true;
    }, [dropLine]);

    return handleDragOver;
}

export const useDragLeave: DndHanlder<"native"> = (dropLine: HTMLDivElement) => {
    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        console.log(dropLine);
        if(!dropLine) return false;
        dropLine.classList.remove("drop-line-top");
        dropLine.classList.remove("drop-line-bottom");
        return true;
    }, [dropLine]);

    return handleDragLeave
}

export const useDrop: DndHanlder<"native"> = () => {
    return () => { };
}