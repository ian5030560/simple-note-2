import { createPortal } from "react-dom"
import { useAnchor } from "../../Draggable/component"
import styles from "./action.module.css";
import { NodeKey } from "lexical";
import { useEffect, useMemo, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React from "react";

type Key = "top" | "bottom" | "left" | "right";
type Outside = boolean;
export type Placement = Key[] | Partial<Record<Key, Outside>>;
interface ActionProps {
    nodeKey: NodeKey;
    children: React.ReactNode;
    placement?: Placement;
    open: boolean;
    autoWidth?: boolean;
    autoHeight?: boolean;
}
export default function Action(props: ActionProps) {
    const anchor = useAnchor();
    const [pos, setPos] = useState<{ x: number, y: number }>();
    const [editor] = useLexicalComposerContext();
    const element = useMemo(() => editor.getElementByKey(props.nodeKey), [editor, props.nodeKey]);
    const placement = useMemo(() => props.placement || [], [props.placement]);
    const [size, setSize] = useState<{ width?: number, height?: number }>();

    useEffect(() => {
        if (!element) return;

        function update() {
            if (!anchor) return;

            const { x, y, width, height } = element!.getBoundingClientRect();
            const { left, top } = anchor.getBoundingClientRect();
            const { x: rx, y: ry } = { x: x - left, y: y - top };
            const center = {
                x: rx + width / 2,
                y: ry + height / 2,
            }

            const _placement = Array.isArray(placement) ? placement : Object.keys(placement);
            const map: any = {
                "top": () => center.y -= height / 2,
                "bottom": () => center.y += height / 2,
                "left": () => center.x -= width / 2,
                "right": () => center.x += width / 2
            }
            for (const place of _placement) {
                map[place]();
            }
            setPos({ ...center });

            const { autoHeight, autoWidth } = props;
            const resize: { width?: number, height?: number } = {};
            if (!element) return resize;

            if (autoWidth) {
                resize.width = width;
            }
            if (autoHeight) {
                resize.height = height;
            }

            setSize({ ...resize });
        }

        update();
        const resizer = new ResizeObserver(update);
        resizer.observe(element);

        return () => {
            resizer.unobserve(element);
            resizer.disconnect();
        }
    }, [anchor, element, placement, props]);

    const adjustPos = useMemo(() => {
        const offset = { x: 0, y: 0 };
        if (Array.isArray(placement)){
            if(placement.includes("right")){
                offset.x = -100;
            }

            if(placement.includes("bottom")){
                offset.y = -100;
            }

            return offset;
        }
    
        Object.keys(placement).forEach(key => {
            if((key === "left" && placement.left) || (key === "right" && !placement.right)){
                offset.x = -100;
            }
            if((key === "top" && placement.top) || (key === "bottom" && !placement.bottom)){
                offset.y = -100;
            }
        });

        return offset;
    }, [placement]);

    return <>
        {
            anchor && element && createPortal(<div className={styles.actionContainer}
                style={{
                    transform: pos ? `translate(calc(${pos.x}px + ${adjustPos.x}%), calc(${pos.y}px + ${adjustPos.y}%))` : undefined,
                    display: !props.open ? "none" : undefined,
                    opacity: !props.open ? 0 : 1,
                    ...size
                }}>
                {props.children}
            </div>, anchor)
        }
    </>
}