import { createPortal } from "react-dom"
import { useWrapper } from "../../Draggable/component"
import styles from "./corner.module.css";
import { $getSelection, BaseSelection, Klass, LexicalNode, SELECTION_CHANGE_COMMAND } from "lexical";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export type Placement = "top" | "bottom" | "left" | "right";
export type CornerRef = {
    place: (key: string) => void;
    leave: () => void;
}
export interface CornerProp {
    children: React.ReactNode;
    placement: Placement[];
    nodeType: Klass<LexicalNode>;
    onEnterNode?: (key: string) => void;
    onLeaveNode?: (key: string) => void;
    onSeletionChange?: (selection: BaseSelection | null) => void;
    trigger: "hover" | "selected";
}
const DEFAULT = { top: -10000, left: -10000 }
const Corner = forwardRef((prop: CornerProp, ref: React.ForwardedRef<CornerRef>) => {
    const wrapper = useWrapper();
    const [editor] = useLexicalComposerContext();
    const [pos, setPos] = useState(DEFAULT);
    const containerRef = useRef<HTMLDivElement>(null);

    const place = useCallback((key: string) => {
        let element = editor.getElementByKey(key)!;
        const {x, y, width, height} = element.getBoundingClientRect();
        const {top: offsetTop, left: offsetLeft} = wrapper!.getBoundingClientRect();
        const {width: offsetWidth, height: offsetHeight} = containerRef.current!.getBoundingClientRect();

        let top = y - offsetTop + height / 2;
        let left = x - offsetLeft + width / 2;
        for(let p of prop.placement){
            switch(p){
                case "top":
                    top -= height / 2;
                    break;
                case "left":
                    left -= width / 2;
                    break;
                case "bottom":
                    top += (height / 2 - offsetHeight);
                    break;
                case "right":
                    left += (width / 2 - offsetWidth);
            }
        }

        setPos({top: top, left: left});
    }, [editor, prop.placement, wrapper]);

    useImperativeHandle(ref, () => ({
        place: place,
        leave: () => setPos(DEFAULT)
    }), [place]);

    useEffect(() => {
        function handleEnter(key: string) {
            prop.onEnterNode?.(key);
            place(key);
        }

        function handleLeave(e: PointerEvent, key: string) {
            let { clientX, clientY } = e;
            let { x, y, width, height } = editor.getElementByKey(key)!.getBoundingClientRect();
            if (clientX >= x && clientX <= x + width && clientY >= y && clientY <= y + height) return;
            setPos(DEFAULT);
            prop.onLeaveNode?.(key);
        }

        let removeHover = prop.trigger === "hover" ? editor.registerMutationListener(prop.nodeType, mutations => {
            Array.from(mutations).forEach(([key, tag]) => {
                if (tag === "updated") return;
                let element = editor.getElementByKey(key);
                const enter = () => handleEnter(key);
                const leave = (e: PointerEvent) => handleLeave(e, key);

                if (tag === "created") {
                    element?.addEventListener("pointerenter", enter);
                    element?.addEventListener("pointerleave", leave);
                }
                else {
                    element?.removeEventListener("pointerenter", enter);
                    element?.removeEventListener("pointerleave", leave);
                    setPos(DEFAULT);
                }
            })
        }) : undefined;

        let removeSelect = prop.trigger === "selected" ? editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            editor.update(() => prop.onSeletionChange?.($getSelection()));
            return false;
        }, 1) : null;

        return () => {
            removeHover?.();
            removeSelect?.();
        }
    }, [editor, place, prop, prop.nodeType]);

    return wrapper ? createPortal(<div className={`${styles.cornerContainer}`}
        style={{ transform: `translate(${pos.left}px, ${pos.top}px)` }} ref={containerRef}>
        {prop.children}</div>, wrapper) : null;
})

export default Corner;