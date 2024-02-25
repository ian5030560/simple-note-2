import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ImageNode, { ImageNodeProp } from "./node";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, CLICK_COMMAND } from "lexical";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import styles from "./component.module.css";
import styled, {css} from "styled-components";

enum Direction {
    LEFT = "top: 50%; left: 0%; cursor: w-resize; transform: translate(-7px, -7px);",
    TOPLEFT = "top: 0%; left: 0%; cursor: nw-resize; transform: translate(-7px, -7px);",
    BOTTOMLEFT = "top: 100%; left: 0%; cursor: sw-resize; transform: translate(-7px, -7px);",
    BOTTOM = "top: 100%; left: 50%; cursor: s-resize; transform: translate(-7px, -3.5px);",
    BOTTOMRIGHT = "top: 100%; left: 100%; cursor: nwse-resize; transform: translate(-3.5px, -3.5px);",
    RIGHT = "top: 50%; left: 100%; cursor: e-resize;",
    TOPRIGHT = "top: 0%; left: 100%; cursor: ne-resize; transform: translate(0px, -7px);",
    TOP = "top: 0%; left: 50%; cursor: n-resize; transform: translate(-7px, -7px);",
}

const HandlePin = styled.div<{$direction: string}>`
    ${({$direction}) => css`${$direction}`}
`

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

        offsetX = isVertical ? 0 : offsetX;
        offsetY = isHorizontal ? 0 : offsetY;

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

    return <div style={{ position: "relative", display: "inline-block" }} ref={ref}>
        {prop.children}
        {prop.showHandle &&
            <>
                <HandlePin className={styles["handle-pin"]} $direction={Direction.BOTTOM} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOM)} />
                <HandlePin className={styles["handle-pin"]}  $direction={Direction.BOTTOMLEFT} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOMLEFT)} />
                <HandlePin className={styles["handle-pin"]}  $direction={Direction.BOTTOMRIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOMRIGHT)} />
                <HandlePin className={styles["handle-pin"]}  $direction={Direction.LEFT} onPointerDown={(e) => handlePointerDown(e, Direction.LEFT)} />
                <HandlePin className={styles["handle-pin"]}  $direction={Direction.RIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.RIGHT)} />
                <HandlePin className={styles["handle-pin"]}  $direction={Direction.TOPLEFT} onPointerDown={(e) => handlePointerDown(e, Direction.TOPLEFT)} />
                <HandlePin className={styles["handle-pin"]}  $direction={Direction.TOPRIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.TOPRIGHT)} />
                <HandlePin className={styles["handle-pin"]}  $direction={Direction.TOP} onPointerDown={(e) => handlePointerDown(e, Direction.TOP)} />
            </>
        }
    </div>
};

type ImageProp = ImageNodeProp;
const ImageView: React.FC<ImageProp> = ({ src, alt, height, width, nodeKey }) => {
    const [editor] = useLexicalComposerContext();
    const sizeRef = useRef<{ width: number, height: number }>();
    const imageRef = useRef<HTMLImageElement>(null);
    const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey!);

    const MAX = useMemo(() => editor.getRootElement()?.getBoundingClientRect().width, [editor]);

    const handleStart = useCallback(() => {
        const image = imageRef.current!;
        sizeRef.current = { width: image.width, height: image.height };
    }, []);

    const handleResize = useCallback((offsetWidth: number, offsetHeight: number) => {

        const image = imageRef.current!;
        image.style.width = `${sizeRef.current!.width + offsetWidth}px`;
        image.style.height = `${sizeRef.current!.height + offsetHeight}px`;
    }, []);

    const handleEnd = useCallback(() => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey!)! as ImageNode;
            const image = imageRef.current!;
            node.setWidth(image.width);
            node.setHeight(image.height);
        })
        sizeRef.current = undefined;
    }, [editor, nodeKey]);

    const handleClick = useCallback((e: MouseEvent) => {
        if(e.target === imageRef.current){
            setSelected(!isSelected);
        }
        
        return false;
    }, [isSelected, setSelected]);

    useEffect(() => {
        return editor.registerCommand(CLICK_COMMAND, handleClick, 1);
    }, [editor, handleClick]);

    return <Resizer onResize={handleResize} onResizeStart={handleStart} onResizeEnd={handleEnd} showHandle={isSelected}>
        <img src={src} alt={alt}
            style={{
                height: height,
                width: width,
                maxWidth: MAX ? MAX / 2 : undefined,
            }}
            ref={imageRef} />
    </Resizer>;
}

export default ImageView;