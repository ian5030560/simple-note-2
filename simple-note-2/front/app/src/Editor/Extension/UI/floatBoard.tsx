import React, { useEffect, useRef } from "react";
import styles from "./floatBoard.module.css";

type Placement = "top" | "left" | "right" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center";
const PLACEMENT = {
    top: styles.floatTop,
    left: styles.floatLeft,
    right: styles.floatRight,
    center: styles.floatCenter,
    bottom: styles.floatBottom,
    topLeft: styles.floatTopLeft,
    topRight: styles.floatTopRight,
    bottomLeft: styles.floatBottomLeft,
    bottomRight: styles.floatBottomRight,
}

function contains(x: number, y: number, element: HTMLElement): boolean {
    const {top, left, width, height} = element.getBoundingClientRect();
    return x >= left && x <= left + width && y >= top && y <= top + height;
}
export interface FloatBoardProp {
    children: React.ReactNode;
    placement?: Placement;
    content: React.ReactNode;
    onEnter?: () => void;
    onLeave?: () => void;
}
export default function FloatBoard(prop: FloatBoardProp) {
    
    const ref = useRef<HTMLElement>(null);
    const cRef = useRef<HTMLElement>(null);

    useEffect(() => {
        function enter(e: MouseEvent){
            if(!e.target || !ref.current || !cRef.current) return;
            const {clientX, clientY} = e;
            if(contains(clientX, clientY, ref.current) && contains(clientX, clientY, ref.current)){
                prop.onEnter?.();
            }
        }

        function leave(e: MouseEvent){
            if(!e.target || !ref.current || !cRef.current) return;
            const {clientX, clientY} = e;
            if(!contains(clientX, clientY, ref.current) && !contains(clientX, clientY, ref.current)){
                prop.onLeave?.();
            }
        }

        const element = ref.current;
        const cElement = cRef.current;
        element?.parentElement?.classList.add(styles.floatRelative);
        element?.addEventListener("mouseenter", enter);
        element?.addEventListener("mouseleave", leave);
        cElement?.classList.add(styles.floatAbsolute, PLACEMENT[prop.placement || "topLeft"]);
        cElement?.addEventListener("mouseenter", enter);
        cElement?.removeEventListener("mouseleave", leave);

        return () => {
            element?.parentElement?.classList.remove(styles.floatRelative);
            element?.removeEventListener("mouseenter", enter);
            element?.removeEventListener("mouseleave", leave);
            cElement?.classList.remove(styles.floatAbsolute, PLACEMENT[prop.placement || "topLeft"]);
            cElement?.removeEventListener("mouseenter", enter);
            cElement?.removeEventListener("mouseleave", leave);
        }
    }, [prop, prop.placement]);

    return <>
        {React.cloneElement(prop.children as React.JSX.Element, {
            ref: ref,
        })}

        {React.cloneElement(prop.content as React.JSX.Element, {
            ref: cRef,
        })}
    </>
}