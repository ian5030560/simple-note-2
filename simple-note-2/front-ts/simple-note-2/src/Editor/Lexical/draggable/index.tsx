import { DragEventHandler, EventHandler, useCallback, useEffect, useRef, useState } from "react";
import { Plugin } from "../Interface";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $isBlockElementNode, LexicalNode } from "lexical";
import "./index.css";
import { createPortal } from "react-dom";
import DraggableElement, { DropLine } from "./component";
import { useDragLeave, useDragOver, useDragStart } from "./dnd";

export interface DraggableProp {
    addList?: any[],
}
const DraggablePlugin: Plugin<DraggableProp> = ({ addList }) => {
    const [editor] = useLexicalComposerContext();
    const dragRef = useRef<HTMLElement>(null);
    const [draggableElement, setDraggableElement] = useState<HTMLElement>();
    const rootRef = useRef<HTMLElement>();
    const dropRef = useRef<HTMLDivElement>(null);
    const handleDragStart = useDragStart(draggableElement);
    const handleDragOver = useDragOver(dropRef.current);
    const handleDragLeave = useDragLeave(dropRef.current);

    const handleMouseEnter = useCallback((e: MouseEvent) => setDraggableElement(e.target as HTMLElement), []);
    
    const bindMouseEnter = useCallback((node: LexicalNode | undefined) => {
        if (!$isBlockElementNode(node)) return;
        const element = editor.getElementByKey(node.getKey());

        if (!element) return;
        element.setAttribute("draggable-item", node.getKey());
        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("dragover", handleDragOver);
        element.addEventListener("dragleave", handleDragLeave);

    }, [editor, handleDragLeave, handleDragOver, handleMouseEnter]);

    useEffect(() => {
        const root = document.getElementById("dnd-wrapper");
        if (!root) return;
        rootRef.current = root;

        editor.update(() => {
            const nodes = $getRoot().getChildren();
            nodes.forEach(node => bindMouseEnter(node));
        });

        editor.registerUpdateListener(({ editorState, prevEditorState }) => {
            let current = editorState._nodeMap.size;
            let prev = prevEditorState._nodeMap.size;

            if (current <= prev) return;

            const node = editorState._nodeMap.get((current - 1).toString());
            editorState.read(() => bindMouseEnter(node));
        });

        return () => {
            editor.update(() => {
                const keys = $getRoot().getChildrenKeys();
                for (let key of keys) {
                    const element = editor.getElementByKey(key);
                    element?.removeEventListener("mouseenter", handleMouseEnter);
                    element?.removeEventListener("dragover", handleDragOver);
                    element?.removeEventListener("dragleave", handleDragLeave);
                }
            })
        }
    }, [bindMouseEnter, editor, handleDragLeave, handleDragOver, handleMouseEnter]);

    useEffect(() => {
        if (draggableElement && dragRef.current) {
            let rect = draggableElement.getBoundingClientRect();
            let scrollRect = document.body.getBoundingClientRect();
            let offset = 0;
            dragRef.current.style.top = `${rect.top - scrollRect.top - offset}px`;
            dragRef.current.style.left = `${5}%`;
            dragRef.current.style.height = `${rect.height}px`;
        }
    }, [draggableElement]);

    return rootRef.current ? createPortal(
        <>
            <DraggableElement ref={dragRef} draggable={true} 
            onDragStart={handleDragStart}/>
            <DropLine ref={dropRef} style={{width: "100%", borderColor: "black"}}/>
        </>,
        rootRef.current
    ) : null;
}

export default DraggablePlugin;