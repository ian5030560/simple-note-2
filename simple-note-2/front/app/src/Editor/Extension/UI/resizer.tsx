import React, { useCallback, useMemo, useRef } from "react";
import styles from "./resizer.module.css";

enum Direction {
    LEFT = styles.resizeLeft,
    TOPLEFT = styles.resizeTopLeft,
    BOTTOMLEFT = styles.resizeBottomLeft,
    BOTTOM = styles.resizeBottom,
    BOTTOMRIGHT = styles.resizeBottomRight,
    RIGHT = styles.resizeRight,
    TOPRIGHT = styles.resizeTopRight,
    TOP = styles.resizeTop,
}

interface HandlePinProp extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    className: string | undefined,
    $direction: Direction
}
const HandlePin = ({ className, $direction, ...prop }: HandlePinProp) => <div className={`${className} ${$direction}`} {...prop} />

type ResizeData = {
    element: {
        w: number;
        h: number;
    };
    mouse: {
        x: number;
        y: number;
    }
}
interface ResizerProp {
    children: React.ReactNode;
    showHandle?: boolean
    onResizeStart?: () => void;
    onResize?: (offsetWidth: number, offsetHeight: number) => void;
    onResizeEnd?: () => void;
}
const Resizer: React.FC<ResizerProp> = (prop) => {

    const directionRef = useRef<Direction>();
    const resizeData = useRef<ResizeData>({ element: { w: 0, h: 0 }, mouse: { x: 0, y: 0 } });
    const ref = useRef<HTMLDivElement>(null);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        const { element, mouse } = resizeData.current;

        let offsetX = clientX - mouse.x;
        let offsetY = clientY - mouse.y;

        const isHorizontal = directionRef.current === Direction.LEFT || directionRef.current === Direction.RIGHT;
        const isVertical = directionRef.current === Direction.TOP || directionRef.current === Direction.BOTTOM;

        const invertX = [Direction.LEFT, Direction.TOPLEFT, Direction.BOTTOMLEFT];
        const isInvertX = directionRef.current ? invertX.includes(directionRef.current) : false;

        const invertY = [Direction.TOP, Direction.TOPLEFT, Direction.TOPRIGHT];
        const isInvertY = directionRef.current ? invertY.includes(directionRef.current) : false;

        offsetX = isVertical ? 0 : isInvertX ? -offsetX : offsetX;
        offsetY = isHorizontal ? 0 : isInvertY ? -offsetY : offsetY;

        // let two = [Direction.TOPLEFT, Direction.TOPRIGHT, Direction.BOTTOMLEFT, Direction.BOTTOMRIGHT];
        // let isTwo = directionRef.current ? two.includes(directionRef.current) : false;
        // let absX = Math.abs(offsetX);
        // let absY = Math.abs(offsetY);
        // isTwo && absX < absY ? offsetX = offsetY : offsetY = offsetX;

        prop.onResize?.(element.w + offsetX, element.h + offsetY);

    }, [prop]);

    const handlePointerUp = useCallback(() => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.body.style.removeProperty("user-select");
        prop.onResizeEnd?.();
    }, [handlePointerMove, prop]);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, direction: Direction) => {
        e.preventDefault();
        if (!ref.current) return;

        prop.onResizeStart?.();
        directionRef.current = direction;
        const { width, height } = ref.current.getBoundingClientRect();
        resizeData.current = {
            element: { w: width, h: height },
            mouse: { x: e.clientX, y: e.clientY }
        }
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
        document.body.style.userSelect = "none";

    }, [handlePointerMove, handlePointerUp, prop]);

    return <div ref={ref}>
        {prop.children}
        {prop.showHandle &&
            <>
                <HandlePin className={styles.handlePin} $direction={Direction.BOTTOM} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOM)} />
                <HandlePin className={styles.handlePin} $direction={Direction.BOTTOMLEFT} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOMLEFT)} />
                <HandlePin className={styles.handlePin} $direction={Direction.BOTTOMRIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOMRIGHT)} />
                <HandlePin className={styles.handlePin} $direction={Direction.LEFT} onPointerDown={(e) => handlePointerDown(e, Direction.LEFT)} />
                <HandlePin className={styles.handlePin} $direction={Direction.RIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.RIGHT)} />
                <HandlePin className={styles.handlePin} $direction={Direction.TOPLEFT} onPointerDown={(e) => handlePointerDown(e, Direction.TOPLEFT)} />
                <HandlePin className={styles.handlePin} $direction={Direction.TOPRIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.TOPRIGHT)} />
                <HandlePin className={styles.handlePin} $direction={Direction.TOP} onPointerDown={(e) => handlePointerDown(e, Direction.TOP)} />
            </>
        }
    </div>
};

export default Resizer;