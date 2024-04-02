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
    style?: Omit<React.CSSProperties, "transform">;
    className?: string | undefined;
    outside?: boolean;
    autoWidth?: boolean;
    autoHeight?: boolean;
}
const DEFAULT = { top: -10000, left: -10000 }
const Corner = forwardRef((prop: CornerProp, ref: React.ForwardedRef<CornerRef>) => {
    const wrapper = useWrapper();
    const [editor] = useLexicalComposerContext();
    const [pos, setPos] = useState(DEFAULT);
    const containerRef = useRef<HTMLDivElement>(null);
    const [key, setKey] = useState<string>("");

    const place = useCallback((key: string) => {
        let element = editor.getElementByKey(key);
        if (!element || !wrapper || !containerRef.current) return;
        const { x, y, width, height } = element.getBoundingClientRect();
        const { top: offsetTop, left: offsetLeft } = wrapper.getBoundingClientRect();
        const { width: offsetWidth, height: offsetHeight } = containerRef.current.getBoundingClientRect();

        let top = y - offsetTop + height / 2 - offsetHeight / 2;
        let left = x - offsetLeft + width / 2 - offsetWidth / 2;
        for (let p of prop.placement) {
            switch (p) {
                case "top":
                    top -= height / 2 + (!prop.outside ?  - offsetHeight / 2 : offsetHeight / 2);
                    break;
                case "left":
                    left -= width / 2 + (!prop.outside ? - offsetWidth / 2 : offsetWidth / 2);
                    break;
                case "bottom":
                    top += height / 2 + (!prop.outside ?  - offsetHeight / 2 : offsetHeight / 2);
                    break;
                case "right":
                    left += width / 2 + (!prop.outside ? - offsetWidth / 2 : offsetWidth / 2);
            }
        }
        setPos({ top: top, left: left });
        if(prop.autoWidth){
            containerRef.current.style.width = width + "px";
        }
        
        if(prop.autoHeight){
            containerRef.current.style.height = height + "px";
        }

    }, [editor, prop.autoHeight, prop.autoWidth, prop.outside, prop.placement, wrapper]);

    useImperativeHandle(ref, () => ({
        place: (key) => { 
            setKey(key); 
            place(key); 
        },
        leave: () => setPos(DEFAULT)
    }), [place]);

    useEffect(() => {
        let resizer = new ResizeObserver(() => {
            place(key);
        });

        resizer.observe(document.body);
        return () => {
            resizer.unobserve(document.body);
            resizer.disconnect();
        }
    }, [key, place]);

    useEffect(() => {
        function handleEnter(key: string) {
            prop.onEnterNode?.(key);
            place(key);
            setKey(key);
        }

        function handleLeave(e: PointerEvent, key: string) {
            let { clientX, clientY } = e;
            let { x, y, width, height } = editor.getElementByKey(key)!.getBoundingClientRect();
            if (clientX >= x && clientX <= x + width && clientY >= y && clientY <= y + height) return;
            setPos(DEFAULT);
            prop.onLeaveNode?.(key);
            setKey("");
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
                    setKey("");
                }
            })
        }) : null;

        let removeSelect = prop.trigger === "selected" ? editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            editor.update(() => prop.onSeletionChange?.($getSelection()));
            return false;
        }, 1) : null;

        let removeDestroy = editor.registerMutationListener(prop.nodeType, mutations => {
            Array.from(mutations).forEach(([, tag]) => {
                if (tag === "destroyed") {
                    setPos(DEFAULT);
                    setKey("");
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