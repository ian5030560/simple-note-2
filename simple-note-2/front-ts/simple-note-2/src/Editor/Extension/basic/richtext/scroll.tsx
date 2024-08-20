import { useEffect, useState } from "react";
import styles from "./index.module.css";

export default function Scroller({ children }: { children: React.ReactNode }) {
    const [height, setHeight] = useState<number>();
    useEffect(() => {
        let toolbar = document.getElementById("toolbar-container");
        let toolkit = document.getElementById("toolkit-container");
        if (!toolbar || !toolkit) return;

        document.body.style.overflowY = "hidden";
        let observer = new ResizeObserver(() => {
            let { height: bodyHeight } = document.body.getBoundingClientRect();
            let { height: toolbarHeight } = toolbar!.getBoundingClientRect();
            let { height: toolkitHeight } = toolkit!.getBoundingClientRect();
            setHeight(bodyHeight - toolbarHeight - toolkitHeight);
        });

        observer.observe(document.body);
        observer.observe(toolbar!);
        observer.observe(toolkit!);

        return () => {
            observer.unobserve(document.body);
            observer.unobserve(toolbar!);
            observer.unobserve(toolkit!);
            observer.disconnect();
            document.body.style.overflowY = "initial";
        }
    }, []);

    return <div className={styles.editorScroller} style={{ maxHeight: height }}>
        {children}
    </div>
}