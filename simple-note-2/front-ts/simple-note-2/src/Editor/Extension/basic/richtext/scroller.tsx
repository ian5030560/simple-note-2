import React, {useEffect, useState} from "react";
import styles from "./index.module.css";

export interface ScrollerProp extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    style?: Omit<React.CSSProperties, "height">
}
const Scroller: React.FC<ScrollerProp> = (prop) => {
    
    return <div className={styles["editor-scroller"]} id="scroller" style={{
        maxHeight: `${538.2}px`,
    }} {...prop} />
}
export default Scroller;

export const useScroller = () => {
    const [scroller, setScroller] = useState<HTMLElement | null>(null);

    useEffect(() => {
        let sc = document.getElementById("scroller");
        setScroller(sc);
    }, []);

    return scroller;
}