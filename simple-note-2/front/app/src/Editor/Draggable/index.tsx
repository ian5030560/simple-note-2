import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "../Extension";
import { PlusItem, useAnchor } from "./component";
import { createPortal } from "react-dom";
import { DragHandler, DragLine } from "./component";
import { useCallback, useEffect, useMemo, useState } from "react";
import { inside } from "../Extension/UI/utils";
import { getBlockFromPoint } from "./util";
import { eventFiles } from "@lexical/rich-text";
import { $getNodeByKey, $getRoot, DRAGOVER_COMMAND, DROP_COMMAND, NodeKey } from "lexical";
import { mergeRegister } from "@lexical/utils";

export const DRAGGABLE_TAG = "draggable-item";
const HEIGHT = 5;
type HandlerState = {
    x: number;
    y: number;
}

type LineState = {
    x: number;
    y: number;
    width: number;
    height: number;
}
const DraggablePlugin: Plugin<{ items: PlusItem[] }> = (props) => {
    const [editor] = useLexicalComposerContext();
    const anchor = useAnchor();
    const scroller = useMemo(() => anchor?.parentElement, [anchor]);
    const [handler, setHandler] = useState<HandlerState>();
    const [line, setLine] = useState<LineState>();
    const [dragging, setDragging] = useState(false);
    const [id, setId] = useState<NodeKey>();

    useEffect(() => editor.registerUpdateListener(({ editorState }) => {
        const keys = editorState.read(() => $getRoot().getChildrenKeys());
        keys.forEach(key => {
            const el = editor.getElementByKey(key);
            if (!el || el.hasAttribute(DRAGGABLE_TAG)) return;

            el.setAttribute(DRAGGABLE_TAG, key);
        });
    }));

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const { clientX, clientY } = e;
        if (!anchor || !scroller || !inside(clientX, clientX, scroller)) return;

        const element = getBlockFromPoint(editor, clientX, clientY, scroller);
        if (!element) return;

        const { x, y } = element.getBoundingClientRect();
        const { top, left } = anchor.getBoundingClientRect();
        const { marginTop } = window.getComputedStyle(element);
        
        setHandler({ x: x - left, y: y - top + parseFloat(marginTop) / 2 });
        setId(element.getAttribute(DRAGGABLE_TAG)!);

    }, [anchor, editor, scroller]);

    const handleMouseLeave = useCallback((e: MouseEvent) => {
        const mask = document.getElementById("menu-mask");
        const { relatedTarget } = e;
        if (mask === relatedTarget) return;

        setHandler(undefined);
    }, []);

    const handleDragOver = useCallback((e: DragEvent) => {
        if (!e.dataTransfer || eventFiles(e)[0] || !dragging) return false;
        e.preventDefault();

        const { clientY: mouseY } = e;

        const overElement = getBlockFromPoint(editor, e.clientX, e.clientY);

        if (!overElement || !overElement.hasAttribute(DRAGGABLE_TAG)) return false;

        let { x, y, width, height } = overElement.getBoundingClientRect();
        const { top, left } = document.getElementById("dnd-anchor")!.getBoundingClientRect();

        const { marginTop, marginBottom } = window.getComputedStyle(overElement);

        const overHalf = mouseY > (y + height / 2);
        if (!overHalf) {
            const previous = overElement.previousElementSibling;

            if (!previous) {
                y -= HEIGHT;
            }
            else {
                const { marginBottom: pMarginBottom } = window.getComputedStyle(previous);
                const offset = Math.max(parseFloat(pMarginBottom), parseFloat(marginTop)) / 2;
                y -= offset;
            }
        }
        else {
            const next = overElement.nextElementSibling;
            y += height;
            if (!next) {
                y += HEIGHT;
            }
            else {
                const { marginTop: nMarginTop } = window.getComputedStyle(next);
                const offset = Math.max(parseFloat(nMarginTop), parseFloat(marginBottom)) / 2;
                y += offset;
            }
        }

        x -= left;
        y -= top;

        setLine({ x, y, width, height: HEIGHT });

        return true;
    }, [dragging, editor]);

    const handleDrop = useCallback((e: DragEvent) => {
        if (!e.dataTransfer || eventFiles(e)[0] || !dragging) return false;
        e.preventDefault();

        const dropElement = getBlockFromPoint(editor, e.clientX, e.clientY);

        if (!dropElement || !dropElement.hasAttribute(DRAGGABLE_TAG)) return false;

        editor.update(() => {
            const dropKey = dropElement!.getAttribute(DRAGGABLE_TAG);
            const dragKey = id;

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
        });

        return true;
    }, [dragging, editor, id, line]);

    useEffect(() => {
        scroller?.addEventListener("mousemove", handleMouseMove);
        scroller?.addEventListener("mouseleave", handleMouseLeave);
        const remove = mergeRegister(
            editor.registerCommand(DRAGOVER_COMMAND, handleDragOver, 1),
            editor.registerCommand(DROP_COMMAND, handleDrop, 4)
        )

        return () => {
            scroller?.removeEventListener("mousemove", handleMouseMove);
            scroller?.removeEventListener("mouseleave", handleMouseLeave);
            remove();
        }
    }, [editor, handleDragOver, handleDrop, handleMouseLeave, handleMouseMove, scroller]);

    const handleDragStart = useCallback((e: React.DragEvent) => {
        if (eventFiles(e.nativeEvent)[0] || !e.dataTransfer || !id) return;
        const element = editor.getElementByKey(id);
        if (!element) return;

        e.dataTransfer.setDragImage(element, 0, 0);
        setDragging(true);
    }, [editor, id]);

    const handleDragEnd = useCallback(() => {
        setDragging(false);
        setHandler(undefined);
        setLine(undefined);
        setId(undefined);
    }, []);

    return anchor ? createPortal(<>
        {handler && <DragHandler items={props.items} pos={handler}
            onDragStart={handleDragStart} onDragEnd={handleDragEnd} />}
        {line && <DragLine pos={{ x: line.x, y: line.y }} size={{ width: line.width, height: line.height }} />}
    </>, anchor) : null;
}

export default DraggablePlugin;