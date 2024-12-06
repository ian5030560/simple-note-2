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

interface HandlePinprops {
    className: string | undefined;
    direction: Direction;
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
}
const HandlePin = ({ className, direction, onPointerDown }: HandlePinprops) => <div className={`${className} ${direction}`} onPointerDown={onPointerDown}/>

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
interface Resizerpropss {
    children: React.JSX.Element;
    showHandle?: boolean
    onResize: (width: number, height: number) => void;
}

export default function Resizer(props: Resizerpropss){

    const directionRef = useRef<Direction>();
    const resizeData = useRef<ResizeData>({ element: { w: 0, h: 0 }, mouse: { x: 0, y: 0 } });
    const ref = useRef<HTMLDivElement>(null);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        const { element, mouse } = resizeData.current;

        let offsetX = clientX - mouse.x;
        let offsetY = clientY - mouse.y;
        
        let offset: {x: number, y: number};
        const ratio = element.w / element.h;
        if(offsetX > offsetY){
            offset = {x: offsetX, y: offsetX * (1 / ratio)};
        }
        else{
            offset = {x: offsetY * ratio, y: offsetY};
        }
        switch(directionRef.current){
            case Direction.TOPLEFT:
                props.onResize(element.w - offset.x, element.h - offset.y);
                break;
            case Direction.TOP:
                props.onResize(element.w, element.h - offsetY);
                break;
            case Direction.TOPRIGHT:
                props.onResize(element.w - offset.x, element.h - offset.y);
                break;
            case Direction.BOTTOMLEFT:
                props.onResize(element.w + offset.x, element.h + offset.y);
                break;
            case Direction.BOTTOM:
                props.onResize(element.w, element.h + offsetY);
                break;
            case Direction.BOTTOMRIGHT:
                props.onResize(element.w + offset.x, element.h + offset.y);
                break;
            case Direction.LEFT:
                props.onResize(element.w - offsetX, element.h);
                break;
            default:
                props.onResize(element.w + offsetX, element.h);
        }

    }, [props]);

    const handlePointerUp = useCallback(() => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.body.style.removeProperty("user-select");
    }, [handlePointerMove]);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, direction: Direction) => {
        e.preventDefault();
        if (!ref.current) return;

        directionRef.current = direction;
        const { width, height } = ref.current.getBoundingClientRect();
        resizeData.current = {
            element: { w: width, h: height },
            mouse: { x: e.clientX, y: e.clientY }
        }
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
        document.body.style.userSelect = "none";

    }, [handlePointerMove, handlePointerUp]);

    return <div className={styles.resizeContainer} ref={ref}>
        {React.cloneElement(props.children, { style: { outline: props.showHandle ? "2px solid rgb(60,132,244)" : undefined } })}
        {props.showHandle &&
            <>
                <HandlePin className={styles.handlePin} direction={Direction.BOTTOM} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOM)} />
                <HandlePin className={styles.handlePin} direction={Direction.BOTTOMLEFT} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOMLEFT)} />
                <HandlePin className={styles.handlePin} direction={Direction.BOTTOMRIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOMRIGHT)} />
                <HandlePin className={styles.handlePin} direction={Direction.LEFT} onPointerDown={(e) => handlePointerDown(e, Direction.LEFT)} />
                <HandlePin className={styles.handlePin} direction={Direction.RIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.RIGHT)} />
                <HandlePin className={styles.handlePin} direction={Direction.TOPLEFT} onPointerDown={(e) => handlePointerDown(e, Direction.TOPLEFT)} />
                <HandlePin className={styles.handlePin} direction={Direction.TOPRIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.TOPRIGHT)} />
                <HandlePin className={styles.handlePin} direction={Direction.TOP} onPointerDown={(e) => handlePointerDown(e, Direction.TOP)} />
            </>
        }
    </div>
};