import { createPortal } from "react-dom";
import { useWrapper } from "../../Draggable/component"
import styles from "./component.module.css";

interface PlaceholderProp {
    text: string;
    top: number;
    left: number;
}
export const Placeholder = ({ text, top, left }: PlaceholderProp) => {
    const wrapper = useWrapper();

    return wrapper ? createPortal(
        <div className={styles.aiPlaceholder}
            style={{ transform: `translate(${left}px, ${top}px)` }}>
            <p>{text}</p>
        </div>,
        wrapper
    ) : null;
}