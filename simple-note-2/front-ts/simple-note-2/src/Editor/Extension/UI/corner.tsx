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
    style?: React.CSSProperties;
    className?: string | undefined;
    outside?: boolean;
}
const DEFAULT = { top: -10000, left: -10000 }
const Corner = forwardRef((prop: CornerProp, ref: React.ForwardedRef<CornerRef>) => {
    const wrapper = useWrapper();
    const [editor] = useLexicalComposerContext();
    const [pos, setPos] = useState(DEFAULT);
    const containerRef = useRef<HTMLDivElement>(null);
    const keyRef = useRef<string | null>(null);

    const place = useCallback((key: string) => {
        keyRef.current = key;
        let element = editor.getElementByKey(key);
        if (!element || !wrapper) return;
        const { x, y, width, height } = element.getBoundingClientRect();
        const { top: offsetTop, left: offsetLeft } = wrapper.getBoundingClientRect();
        const { width: offsetWidth, height: offsetHeight } = containerRef.current!.getBoundingClientRect();

        let top = y - offsetTop + height / 2;
        let left = x - offsetLeft + width / 2;
        for (let p of prop.placement) {
            switch (p) {
                case "top":
                    top -= !prop.outside ? height / 2 : height / 2 + offsetHeight;
                    break;
                case "left":
                    left -= !prop.outside ? width / 2 : width / 2 + offsetWidth;
                    break;
                case "bottom":
                    top += !prop.outside ? (height / 2 - offsetHeight) : height / 2;
                    break;
                case "right":
                    left += !prop.outside ? (width / 2 - offsetWidth) : width / 2;
            }
        }

        setPos({ top: top, left: left });
    }, [editor, prop.outside, prop.placement, wrapper]);

    useImperativeHandle(ref, () => ({
        place: place,
        leave: () => setPos(DEFAULT)
    }), [place]);

    useEffect(() => {
        let resizer = new ResizeObserver(() => {
            if (keyRef.current) {
                place(keyRef.current);
            }
        });

        resizer.observe(document.body);
        return () => {
            resizer.unobserve(document.body);
            resizer.disconnect();
        }
    }, [place]);

    useEffect(() => {
        function handleEnter(key: string) {
            prop.onEnterNode?.(key);
            place(key);
            keyRef.current = key;
        }

        function handleLeave(e: PointerEvent, key: string) {
            let { clientX, clientY } = e;
            let { x, y, width, height } = editor.getElementByKey(key)!.getBoundingClientRect();
            if (clientX >= x && clientX <= x + width && clientY >= y && clientY <= y + height) return;
            setPos(DEFAULT);
            prop.onLeaveNode?.(key);
            keyRef.current = null;
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
                    keyRef.current = null;
                }
            })
        }) : undefined;

        let removeSelect = prop.trigger === "selected" ? editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            editor.update(() => prop.onSeletionChange?.($getSelection()));
            return false;
        }, 1) : null;

        let removeDestroy = editor.registerMutationListener(prop.nodeType, mutations => {
            Array.from(mutations).forEach(([, tag]) => {
                if(tag === "destroyed"){
                    setPos(DEFAULT);
                }
            })
        })

        return () => {
            removeHover?.();
            removeSelect?.();
            removeDestroy();
        }
    }, [editor, place, prop, prop.nodeType]);

    return wrapper ? createPortal(<div className={[styles.cornerContainer, prop.className].join(" ")}
        style={{ transform: `translate(${pos.left}px, ${pos.top}px)`, ...prop.style }} ref={containerRef}>
        {prop.children}</div>, wrapper) : null;
})

export default Corner;