import React, { useCallback, useMemo, useRef, useState } from "react";
import ImageNode, { $isImageNode, ImageNodeProp } from "./node";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import styled, { css } from "styled-components";
import { $getNodeByKey } from "lexical";

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

const HandlePin = styled.div<{ $direction: Direction }>`
    background-color: blue;
    width: 7px;
    height: 7px;
    position: absolute;
    ${({ $direction }) => css`${$direction}`}
`;

interface ResizerProp {
    children: React.ReactNode;
    onResize?: (offsetWidth: number, offsetHeight: number) => void;
}
const Resizer: React.FC<ResizerProp> = (prop) => {

    const ref = useRef<HTMLDivElement>(null);
    const directionRef = useRef<Direction>();
    const startRef = useRef<{x: number, y: number}>({x: 0, y: 0});

    const handlePointerMove = useCallback((e: PointerEvent) => {
        const { clientX, clientY } = e;

        const {x, y} = startRef.current;

        let offsetX = clientX - x;
        let offsetY = clientY - y;

        switch(directionRef.current!){
            case Direction.BOTTOM:
            case Direction.TOP:
                offsetX = 0;
                break;
            case Direction.LEFT:
            case Direction.RIGHT:
                offsetY = 0;
                break;
            default:
                break;
        }
        prop.onResize?.(offsetX, offsetY);

    }, [prop]);

    const handlePointerUp = useCallback(() => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
    }, [handlePointerMove]);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, direction: Direction) => {
        directionRef.current = direction;
        startRef.current = {x: e.clientX, y: e.clientY};
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
    }, [handlePointerMove, handlePointerUp]);

    return <div style={{ position: "relative", display: "inline-block" }} ref={ref}>
        {prop.children}
        <HandlePin $direction={Direction.BOTTOM} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOM)} />
        <HandlePin $direction={Direction.BOTTOMLEFT} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOMLEFT)} />
        <HandlePin $direction={Direction.BOTTOMRIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.BOTTOMRIGHT)} />
        <HandlePin $direction={Direction.LEFT} onPointerDown={(e) => handlePointerDown(e, Direction.LEFT)} />
        <HandlePin $direction={Direction.RIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.RIGHT)} />
        <HandlePin $direction={Direction.TOPLEFT} onPointerDown={(e) => handlePointerDown(e, Direction.TOPLEFT)} />
        <HandlePin $direction={Direction.TOPRIGHT} onPointerDown={(e) => handlePointerDown(e, Direction.TOPRIGHT)} />
        <HandlePin $direction={Direction.TOP} onPointerDown={(e) => handlePointerDown(e, Direction.TOP)} />
    </div>
};

type ImageProp = ImageNodeProp;
const ImageView: React.FC<ImageProp> = ({ src, alt, height, width, nodeKey }) => {
    const [editor] = useLexicalComposerContext();

    const keyRef = useRef(nodeKey);

    const MAX = useMemo(() => editor.getRootElement()?.getBoundingClientRect().width, [editor]);

    const handleResize = useCallback((offsetWidth: number, offsetHeight: number) => {
        editor.update(() => {

            const node = $getNodeByKey(keyRef.current!)! as ImageNode;
            const wrapper = editor.getElementByKey(keyRef.current!)!.parentElement;
            const { width, height } = wrapper!.getBoundingClientRect();

            node.setWidth(width + offsetWidth);
            node.setHeight(height + offsetHeight);
        })
    }, [editor]);

    return <Resizer onResize={handleResize}>
        <img src={src} alt={alt}
        style={{
            height: height,
            width: width,
            maxWidth: MAX ? MAX / 2 : undefined,
        }} />
    </Resizer>;
}

export default ImageView;