import { createPortal } from "react-dom";
import { useWrapper } from "../../Draggable/component"
import styles from "./component.module.css";
import React, { forwardRef } from "react";

interface PlaceholderProp {
    text: string;
    top: number;
    left: number;
}
export const Placeholder = forwardRef(({ text, top, left }: PlaceholderProp, ref: React.LegacyRef<HTMLDivElement>) => {
    const wrapper = useWrapper();

    return wrapper ? createPortal(
        <div className={styles.aiPlaceholder} ref={ref}
            style={{ transform: `translate(${left}px, ${top}px)` }}>
            <span>{text}</span>
        </div>,
        wrapper
    ) : null;
})