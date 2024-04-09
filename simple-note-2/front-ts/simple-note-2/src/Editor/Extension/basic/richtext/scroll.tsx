import { useEffect, useState } from "react";
import styles from "./index.module.css";

export default function Scroller({ children }: { children: React.ReactNode }) {
    const [height, setHeight] = useState<number>();
    useEffect(() => {
        let container = document.getElementById("toolbar-container");
        if (!container) return;
        document.body.style.overflowY = "hidden";
        let observer = new ResizeObserver(() => {
            let { height: bHeight } = document.body.getBoundingClientRect();
            let { height } = container!.getBoundingClientRect();
            setHeight(bHeight - height);
        });

        observer.observe(document.body);
        observer.observe(container);

        return () => {
            observer.unobserve(document.body);
            observer.unobserve(container!);
            observer.disconnect();
            document.body.style.overflowY = "initial";
        }
    }, []);

    return <div className={styles["editor-scroller"]} style={{ maxHeight: height }}>
        {children}
    </div>
}