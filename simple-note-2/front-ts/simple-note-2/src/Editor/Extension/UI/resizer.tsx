import React, { useCallback, useRef } from "react";
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

interface ResizerProp {
    children: React.ReactNode;
    showHandle?: boolean
    onResizeStart?: () => void;
    onResize?: (offsetWidth: number, offsetHeight: number) => void;
    onResizeEnd?: () => void;
}
const Resizer: React.FC<ResizerProp> = (prop) => {

    const ref = useRef<HTMLDivElement>(null);
    const directionRef = useRef<Direction>();
    const startRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

    const handlePointerMove = useCallback((e: PointerEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        const { x: startX, y: startY } = startRef.current;

        let offsetX = clientX - startX;
        let offsetY = clientY - startY;

        let isHorizontal = directionRef.current === Direction.LEFT || directionRef.current === Direction.RIGHT;
        let isVertical = directionRef.current === Direction.TOP || directionRef.current === Direction.BOTTOM;

        let invertX = [Direction.LEFT, Direction.TOPLEFT, Direction.BOTTOMLEFT];
        let isInvertX = directionRef.current ? invertX.includes(directionRef.current) : false;

        let invertY = [Direction.TOP, Direction.TOPLEFT, Direction.TOPRIGHT];
        let isInvertY = directionRef.current ? invertY.includes(directionRef.current) : false;

        offsetX = isVertical ? 0 : isInvertX ? -offsetX : offsetX;
        offsetY = isHorizontal ? 0 : isInvertY ? -offsetY : offsetY;

        prop.onResize?.(offsetX, offsetY);

    }, [prop]);

    const handlePointerUp = useCallback(() => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.body.style.removeProperty("user-select");
        prop.onResizeEnd?.();
    }, [handlePointerMove, prop]);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, direction: Direction) => {
        e.preventDefault();
        prop.onResizeStart?.();
        directionRef.current = direction;
        startRef.current = { x: e.clientX, y: e.clientY };
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