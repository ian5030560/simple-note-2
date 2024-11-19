import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { PlusItem } from "./component";
import { createPortal } from "react-dom";
import { DragHandler, DragLine } from "./component";
import { useCallback, useEffect, useMemo, useState } from "react";
import { inside } from "../../utils";
import { getBlockFromPoint } from "./getBlockFromPoint";
import { eventFiles } from "@lexical/rich-text";
import { $getNodeByKey, NodeKey } from "lexical";
import { WithAnchorProps } from "../../ui/action";
import { WithOverlayProps } from "../../types";

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

function gap(topElement: HTMLElement, bottomElement: HTMLElement) {
    const { y, height } = topElement.getBoundingClientRect();
    const { top } = bottomElement.getBoundingClientRect();

    return Math.abs(y + height - top);
}

interface DraggablePluginProps extends WithAnchorProps, WithOverlayProps {
    items: PlusItem[];
}
export default function DraggablePlugin(props: DraggablePluginProps) {
    const [editor] = useLexicalComposerContext();
    const anchor = props.anchor;
    const scroller = useMemo(() => anchor?.parentElement, [anchor]);
    const [handler, setHandler] = useState<HandlerState>();
    const [line, setLine] = useState<LineState>();
    const [dragging, setDragging] = useState(false);
    const [id, setId] = useState<NodeKey>();

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const { clientX, clientY } = e;
        if (!anchor || !scroller || !inside(clientX, clientX, scroller) || !editor.isEditable()) return;

        const key = getBlockFromPoint(editor, clientX, clientY, scroller);
        if (!key) return;

        const element = editor.getElementByKey(key);
        if (!element) return;

        const { x, y } = element.getBoundingClientRect();
        const { top, left } = anchor.getBoundingClientRect();
        const { lineHeight } = window.getComputedStyle(element);

        setHandler({ x: x - left, y: y - top + parseFloat(lineHeight) / 2 });
        setId(key);

    }, [anchor, editor, scroller]);

    const handleMouseLeave = useCallback((e: MouseEvent) => {
        const { relatedTarget } = e;
        if (props.overlayContainer === relatedTarget) return;

        setHandler(undefined);
    }, [props.overlayContainer]);

    const handleDragOver = useCallback((e: DragEvent) => {
        if (!e.dataTransfer || eventFiles(e)[0] || !dragging || !anchor || !scroller) return false;
        const { clientY: mouseY } = e;

        const overKey = getBlockFromPoint(editor, e.clientX, e.clientY, scroller);
        if (!overKey) return;

        const overElement = editor.getElementByKey(overKey);
        if (!overElement) return false;

        e.preventDefault();

        let { x, y, width, height } = overElement.getBoundingClientRect();
        const { top, left } = anchor.getBoundingClientRect();

        const overHalf = mouseY > (y + height / 2);
        if (!overHalf) {
            const previous = overElement.previousElementSibling;
            y -= previous ? gap(previous as HTMLElement, overElement) / 2 : HEIGHT;
        }
        else {
            const next = overElement.nextElementSibling;
            y += next ? gap(overElement, next as HTMLElement) / 2 : HEIGHT;
            y += height;
        }

        x -= left;
        y -= top;

        setLine({ x, y, width, height: HEIGHT });

        return true;
    }, [anchor, dragging, editor, scroller]);

    const handleDrop = useCallback((e: DragEvent) => {
        if (!e.dataTransfer || eventFiles(e)[0] || !dragging || !anchor || !scroller) return false;

        const dropKey = getBlockFromPoint(editor, e.clientX, e.clientY, scroller);
        if (!dropKey) return false;

        const dropElement = editor.getElementByKey(dropKey);
        if (!dropElement) return false;

        e.preventDefault();

        editor.update(() => {
            const dragKey = id;

            if (!dragKey || !dropKey) return false;

            const dropNode = $getNodeByKey(dropKey);
            const dragNode = $getNodeByKey(dragKey);

            if (!dragNode || !dropNode || dragKey === dropKey) return;

            const mouseAt = line!.y! + anchor.getBoundingClientRect().top;

            const { top, height } = dropElement.getBoundingClientRect();
            const half = top + height / 2;

            if (mouseAt < half) {
                dropNode.insertBefore(dragNode);
            }
            else {
                dropNode.insertAfter(dragNode);
            }
        });

        return true;
    }, [anchor, dragging, editor, id, line, scroller]);

    useEffect(() => {
        scroller?.addEventListener("mouseenter", handleMouseMove);
        scroller?.addEventListener("mousemove", handleMouseMove);
        scroller?.addEventListener("mouseleave", handleMouseLeave);
        
        scroller?.addEventListener("dragover", handleDragOver);
        scroller?.addEventListener("drop", handleDrop);

        return () => {
            scroller?.removeEventListener("mouseenter", handleMouseMove);
            scroller?.removeEventListener("mousemove", handleMouseMove);
            scroller?.removeEventListener("mouseleave", handleMouseLeave);
            scroller?.removeEventListener("dragover", handleDragOver);
            scroller?.removeEventListener("drop", handleDrop);
        }
    }, [anchor, handleDragOver, handleDrop, handleMouseLeave, handleMouseMove, scroller]);

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

    return createPortal(<>
        {handler && id && <DragHandler anchor={props.anchor} items={props.items} pos={handler} overlayContainer={props.overlayContainer}
            onDragStart={handleDragStart} onDragEnd={handleDragEnd} nodeKey={id} />}
        {line && <DragLine pos={{ x: line.x, y: line.y }} size={{ width: line.width, height: line.height }} />}
    </>, anchor || document.body);
}